export function authErrorMessage(error: unknown, fallback: string): string {
  const failure = error as { code?: string; status?: number; name?: string; message?: string } | null;
  switch (failure?.code) {
    case 'email_not_confirmed': return 'Confirm your email before signing in. You can request another confirmation email below.';
    case 'otp_expired': return 'The confirmation link has expired. Please request another confirmation email.';
    case 'invalid_credentials': return 'Invalid email or password. Check your details and try again.';
    case 'over_email_send_rate_limit': return 'The email service has reached its sending limit. Please wait before requesting another email.';
    case 'over_request_rate_limit': return 'Too many attempts. Please wait a few minutes before trying again.';
    case 'email_address_not_authorized': return 'Confirmation email could not be sent. The site administrator needs to configure the email service.';
    case 'signup_disabled': return 'Account registration is currently disabled. Please contact support.';
    case 'email_provider_disabled': return 'Email sign-in is currently disabled. Please contact support.';
    case 'weak_password': return 'Choose a stronger password with at least 6 characters.';
  }
  if (failure?.status === 401 || failure?.code === 'bad_jwt') return 'The website authentication configuration needs attention. Please contact support.';
  if (failure?.name === 'AuthRetryableFetchError' || failure?.status === 0 || (failure?.status || 0) >= 502 || /fetch|network|offline/i.test(failure?.message || '')) {
    return 'Unable to connect. Check your connection and try again.';
  }
  if (failure?.status === 500 || failure?.code === 'unexpected_failure') return 'The authentication server could not save or load your account. Please contact support.';
  return fallback;
}

// A local pause prevents repeat submissions; Supabase still controls its own reset window.
export function authRetryDelay(error: unknown): number | undefined {
  const failure = error as { code?: string; status?: number } | null;
  return failure?.status === 429 || failure?.code === 'over_request_rate_limit' || failure?.code === 'over_email_send_rate_limit' ? 60 : undefined;
}

export function authRetryScope(error: unknown): 'email' | 'all' {
  return (error as { code?: string } | null)?.code === 'over_email_send_rate_limit' ? 'email' : 'all';
}
