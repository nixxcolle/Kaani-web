import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user';
  created_at: string;
  last_seen_at?: string;
  is_active?: boolean;
  is_guest?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  role: 'user';
}

export interface LoginData {
  email: string;
  password: string;
}

// Local mock user database key
const LOCAL_USERS_KEY = 'kaani_local_registered_users';

function generateValidUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getLocalUsers(): Array<User & { password_hash: string }> {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUsers(users: Array<User & { password_hash: string }>) {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
}

// Hash password using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Sign up a new user (with automatic local fallback if Supabase is offline)
export async function signUp(data: SignupData): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.name.trim() || cleanEmail.split('@')[0];
    const passwordHash = await hashPassword(data.password);
    const now = new Date().toISOString();
    const newId = generateValidUUID();

    // Try Supabase first
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingUser) {
        return { success: false, error: 'A member account with this email already exists' };
      }

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: newId,
          email: cleanEmail,
          password_hash: passwordHash,
          name: cleanName,
          role: data.role,
          is_active: true,
          created_at: now,
          last_seen_at: now,
          updated_at: now
        })
        .select()
        .single();

      if (!insertError && newUser) {
        const { password_hash, ...userWithoutPassword } = newUser;
        // Keep in local cache for offline redundancy
        const localUsers = getLocalUsers().filter(u => u.email.toLowerCase() !== cleanEmail);
        localUsers.push({ ...(userWithoutPassword as User), password_hash: passwordHash });
        saveLocalUsers(localUsers);

        return { success: true, user: userWithoutPassword as User };
      } else if (insertError) {
        console.warn("Supabase insert warning, saving locally:", insertError);
      }
    } catch (remoteError) {
      console.warn("Supabase unreachable during signup, creating local offline account:", remoteError);
    }

    // Local Fallback
    const localUsers = getLocalUsers();
    if (localUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'User with this email already registered locally' };
    }

    const newUserRecord: User & { password_hash: string } = {
      id: newId,
      email: cleanEmail,
      name: cleanName,
      role: data.role,
      created_at: now,
      last_seen_at: now,
      is_active: true,
      password_hash: passwordHash
    };

    localUsers.push(newUserRecord);
    saveLocalUsers(localUsers);

    const { password_hash, ...userResult } = newUserRecord;
    return { success: true, user: userResult as User };

  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'An unexpected error occurred during signup.' };
  }
}

// Login user (with automatic database activity recording and local fallback)
export async function login(data: LoginData, role: 'user' = 'user'): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const cleanEmail = data.email.trim().toLowerCase();
    const passwordHash = await hashPassword(data.password);
    const now = new Date().toISOString();

    // 1. Try Supabase first
    try {
      const { data: remoteUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .eq('role', role)
        .maybeSingle();

      if (!findError && remoteUser) {
        if (remoteUser.password_hash === passwordHash) {
          // Update last_seen_at, is_active, and updated_at in Supabase database
          try {
            await supabase
              .from('users')
              .update({
                last_seen_at: now,
                is_active: true,
                updated_at: now
              })
              .eq('id', remoteUser.id);
          } catch (updateErr) {
            console.warn("Could not record last_seen_at in Supabase:", updateErr);
          }

          const { password_hash, ...userWithoutPassword } = remoteUser;
          const updatedUser: User = {
            ...userWithoutPassword,
            last_seen_at: now,
            is_active: true
          };

          // Cache locally
          const localUsers = getLocalUsers().filter(u => u.email.toLowerCase() !== cleanEmail);
          localUsers.push({ ...updatedUser, password_hash: passwordHash });
          saveLocalUsers(localUsers);

          return { success: true, user: updatedUser };
        } else {
          return { success: false, error: 'Invalid email or password.' };
        }
      }
    } catch (remoteError) {
      console.warn("Supabase query failed during login, checking local accounts:", remoteError);
    }

    // 2. Local account lookup
    const localUsers = getLocalUsers();
    const matched = localUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (matched) {
      if (matched.password_hash === passwordHash) {
        matched.last_seen_at = now;
        matched.is_active = true;
        saveLocalUsers(localUsers);

        // Try background sync to Supabase if not yet present
        try {
          await supabase.from('users').upsert({
            id: matched.id,
            email: matched.email,
            password_hash: matched.password_hash,
            name: matched.name,
            role: matched.role,
            is_active: true,
            created_at: matched.created_at,
            last_seen_at: now,
            updated_at: now
          });
        } catch {
          // non-blocking
        }

        const { password_hash, ...safeUser } = matched;
        return { success: true, user: safeUser as User };
      } else {
        return { success: false, error: 'Invalid password. Please check your credentials.' };
      }
    }

    // 3. First-time offline fallback or seamless registration
    const fallbackId = generateValidUUID();
    const fallbackUser: User = {
      id: fallbackId,
      email: cleanEmail,
      name: cleanEmail.split('@')[0],
      role: 'user',
      created_at: now,
      last_seen_at: now,
      is_active: true
    };
    
    // Save locally
    localUsers.push({ ...fallbackUser, password_hash: passwordHash });
    saveLocalUsers(localUsers);

    // Try background sync to Supabase
    try {
      await supabase.from('users').insert({
        id: fallbackId,
        email: cleanEmail,
        password_hash: passwordHash,
        name: fallbackUser.name,
        role: 'user',
        is_active: true,
        created_at: now,
        last_seen_at: now,
        updated_at: now
      });
    } catch {
      // offline silent
    }

    return { success: true, user: fallbackUser };

  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An unexpected error occurred during login.' };
  }
}

// User Logout with database status cleanup
export async function logout(currentUser?: User | null): Promise<void> {
  try {
    const user = currentUser || (() => {
      try {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    })();

    if (user && !user.is_guest && user.id) {
      const now = new Date().toISOString();
      // Update remote record in Supabase
      try {
        await supabase
          .from('users')
          .update({
            is_active: false,
            last_seen_at: now,
            updated_at: now
          })
          .eq('id', user.id);
      } catch (e) {
        console.warn("Could not update logout state in Supabase:", e);
      }
    }
  } catch (err) {
    console.warn("Error during logout cleanup:", err);
  } finally {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
  }
}

// Instant Guest Login for frictionless quiz experience
export function createGuestSession(guestName: string = "Agri Learner"): User {
  const guestUser: User = {
    id: "guest-" + Math.random().toString(36).substring(2, 8),
    email: `guest_${Date.now()}@kaani.local`,
    name: guestName,
    role: "user",
    created_at: new Date().toISOString(),
    last_seen_at: new Date().toISOString(),
    is_active: true,
    is_guest: true
  };

  localStorage.setItem('user', JSON.stringify(guestUser));
  localStorage.setItem('isAuthenticated', 'true');
  window.dispatchEvent(new Event('auth-change'));
  return guestUser;
}
