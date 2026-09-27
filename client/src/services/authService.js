/**
 * paradu'l — Mock Authentication Service
 *
 * DEVELOPER NOTICE:
 * This authentication module is an intentionally lightweight, local prototype implementation
 * created to demonstrate the application's user authentication workflow prior to the
 * integration of Supabase Auth in a future phase.
 *
 * DO NOT use this implementation for production security.
 * Once Supabase is integrated, this service will be replaced by `@supabase/supabase-js` auth methods
 * (supabase.auth.signInWithPassword, supabase.auth.signOut, supabase.auth.onAuthStateChange).
 */

const AUTH_STORAGE_KEY = 'paradul:auth_user';

export const DEMO_USER = {
  id: 'usr_demo_01',
  email: 'demo@paradul.com',
  name: 'Jenica Tongol',
  avatar: 'JT',
  role: 'member',
};

/**
 * Validates an email address format
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Retrieves the currently logged-in user from localStorage, if any.
 * @returns {Object|null}
 */
export function getCurrentSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Failed to read auth session from storage', err);
    return null;
  }
}

/**
 * Authenticates a user with email and password.
 * Accepts the documented demo credentials OR any valid-looking email + non-empty password.
 *
 * @param {string} email
 * @param {string} password
 * @param {boolean} [rememberMe=true]
 * @returns {Promise<Object>}
 */
export async function loginWithEmail(email, password, rememberMe = true) {
  // Simulate network round-trip latency
  await new Promise((resolve) => setTimeout(resolve, 350));

  const trimmedEmail = (email || '').trim().toLowerCase();
  const trimmedPassword = (password || '').trim();

  if (!trimmedEmail) {
    throw new Error('Please enter your email address.');
  }

  if (!isValidEmail(trimmedEmail)) {
    throw new Error('Please enter a valid email address (e.g. user@example.com).');
  }

  if (!trimmedPassword || trimmedPassword.length < 4) {
    throw new Error('Password must be at least 4 characters long.');
  }

  // Build authenticated mock user profile
  const user = {
    id: trimmedEmail === DEMO_USER.email ? DEMO_USER.id : `usr_${Date.now().toString(36)}`,
    email: trimmedEmail,
    name: trimmedEmail === DEMO_USER.email ? DEMO_USER.name : trimmedEmail.split('@')[0],
    avatar: (trimmedEmail[0] || 'U').toUpperCase(),
    loggedInAt: new Date().toISOString(),
    isMock: true,
  };

  if (rememberMe) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }

  return user;
}

/**
 * Signs out the current mock user and purges stored credentials.
 * @returns {Promise<void>}
 */
export async function logout() {
  await new Promise((resolve) => setTimeout(resolve, 150));
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}
