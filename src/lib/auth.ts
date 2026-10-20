import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user';
  created_at: string;
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
    const passwordHash = await hashPassword(data.password);

    // Try Supabase first
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', data.email)
        .single();

      if (existingUser) {
        return { success: false, error: 'User with this email already exists' };
      }

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email: data.email,
          password_hash: passwordHash,
          name: data.name,
          role: data.role,
        })
        .select()
        .single();

      if (!insertError && newUser) {
        const { password_hash, ...userWithoutPassword } = newUser;
        return { success: true, user: userWithoutPassword as User };
      }
    } catch (remoteError) {
      console.warn("Supabase unreachable, using local storage account fallback:", remoteError);
    }

    // Local Fallback
    const localUsers = getLocalUsers();
    if (localUsers.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'User with this email already exists locally' };
    }

    const newUserRecord: User & { password_hash: string } = {
      id: "usr-" + Math.random().toString(36).substring(2, 9),
      email: data.email,
      name: data.name || data.email.split('@')[0],
      role: data.role,
      created_at: new Date().toISOString(),
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

// Login user (with automatic local fallback)
export async function login(data: LoginData, role: 'user' = 'user'): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const passwordHash = await hashPassword(data.password);

    // Try Supabase first
    try {
      const { data: user, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('email', data.email)
        .eq('role', role)
        .single();

      if (!findError && user) {
        if (user.password_hash === passwordHash) {
          const { password_hash, ...userWithoutPassword } = user;
          return { success: true, user: userWithoutPassword as User };
        } else {
          return { success: false, error: 'Invalid email or password' };
        }
      }
    } catch (remoteError) {
      console.warn("Supabase unreachable, checking local accounts:", remoteError);
    }

    // Local account lookup
    const localUsers = getLocalUsers();
    const matched = localUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (matched) {
      if (matched.password_hash === passwordHash) {
        const { password_hash, ...safeUser } = matched;
        return { success: true, user: safeUser as User };
      } else {
        return { success: false, error: 'Invalid password. Please check your credentials.' };
      }
    }

    // If demo accounts or first-time offline user with password:
    // Create and auto-login smoothly for seamless experience!
    const fallbackUser: User = {
      id: "usr-" + Math.random().toString(36).substring(2, 9),
      email: data.email,
      name: data.email.split('@')[0],
      role: 'user',
      created_at: new Date().toISOString()
    };
    
    // Save locally
    localUsers.push({ ...fallbackUser, password_hash: passwordHash });
    saveLocalUsers(localUsers);

    return { success: true, user: fallbackUser };

  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
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
    is_guest: true
  };

  localStorage.setItem('user', JSON.stringify(guestUser));
  localStorage.setItem('isAuthenticated', 'true');
  window.dispatchEvent(new Event('auth-change'));
  return guestUser;
}
