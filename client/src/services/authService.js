/**
 * paradu'l — Authentication Service (Supabase Auth & Local Mock Fallback)
 *
 * Implements real email/password authentication using @supabase/supabase-js.
 * When Supabase credentials are configured, it talks to the Supabase Auth server,
 * handling JWT session tokens, sign-ups, sign-ins, and sign-outs.
 * If credentials are not supplied, it gracefully defaults to local mock auth.
 */

import { supabase, isSupabaseConfigured } from '../api/supabaseClient.js';

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
 * Formats a Supabase User object into paradu'l profile format
 */
function formatSupabaseUser(sbUser) {
  if (!sbUser) return null;
  const name =
    sbUser.user_metadata?.full_name ||
    sbUser.user_metadata?.name ||
    sbUser.email?.split('@')[0] ||
    'Member';

  return {
    id: sbUser.id,
    email: sbUser.email,
    name,
    avatar: (name[0] || sbUser.email[0] || 'U').toUpperCase(),
    loggedInAt: sbUser.last_sign_in_at || new Date().toISOString(),
    isMock: false,
    raw: sbUser,
  };
}

/**
 * Retrieves the currently logged-in user (sync check)
 * @returns {Object|null}
 */
export function getCurrentSession() {
  // Check local mock cache or fallback
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

/**
 * Asynchronously loads the active session from Supabase on application startup
 * @returns {Promise<Object|null>}
 */
export async function getActiveUser() {
  if (isSupabaseConfigured) {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error && session?.user) {
        const user = formatSupabaseUser(session.user);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        return user;
      }
    } catch (err) {
      console.warn('Supabase getSession error:', err);
    }
  }
  return getCurrentSession();
}

/**
 * Signs up a new user with email and password
 * @param {string} email
 * @param {string} password
 * @param {string} [name]
 * @returns {Promise<Object>}
 */
export async function signUpWithEmail(email, password, name = '') {
  const trimmedEmail = (email || '').trim().toLowerCase();
  const trimmedPassword = (password || '').trim();

  if (!trimmedEmail) throw new Error('Please enter your email address.');
  if (!isValidEmail(trimmedEmail)) throw new Error('Please enter a valid email address.');
  if (!trimmedPassword || trimmedPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: trimmedPassword,
      options: {
        data: { full_name: name || trimmedEmail.split('@')[0] },
      },
    });

    if (error) {
      console.error('Supabase sign-up error:', error);
      throw new Error(error.message);
    }

    if (data.user) {
      const user = formatSupabaseUser(data.user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return user;
    }
  }

  // Mock Fallback
  return loginWithEmail(trimmedEmail, trimmedPassword);
}

/**
 * Authenticates a user with email and password.
 * @param {string} email
 * @param {string} password
 * @param {boolean} [rememberMe=true]
 * @returns {Promise<Object>}
 */
export async function loginWithEmail(email, password, rememberMe = true) {
  const trimmedEmail = (email || '').trim().toLowerCase();
  const trimmedPassword = (password || '').trim();

  if (!trimmedEmail) throw new Error('Please enter your email address.');
  if (!isValidEmail(trimmedEmail)) throw new Error('Please enter a valid email address.');
  if (!trimmedPassword || trimmedPassword.length < 4) {
    throw new Error('Password must be at least 4 characters long.');
  }

  // 1. If Supabase is configured and not testing demo account, use Supabase Auth
  if (isSupabaseConfigured && trimmedEmail !== DEMO_USER.email) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: trimmedPassword,
    });

    if (error) {
      console.error('Supabase sign-in error:', error);
      throw new Error(error.message);
    }

    if (data?.user) {
      const user = formatSupabaseUser(data.user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return user;
    }
  }

  // 2. Mock Fallback (for demo account or offline testing)
  await new Promise((resolve) => setTimeout(resolve, 250));
  const user = {
    id: trimmedEmail === DEMO_USER.email ? DEMO_USER.id : `usr_${Date.now().toString(36)}`,
    email: trimmedEmail,
    name: trimmedEmail === DEMO_USER.email ? DEMO_USER.name : trimmedEmail.split('@')[0],
    avatar: (trimmedEmail[0] || 'U').toUpperCase(),
    loggedInAt: new Date().toISOString(),
    isMock: !isSupabaseConfigured,
  };

  if (rememberMe) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }

  return user;
}

/**
 * Signs out the current user
 * @returns {Promise<void>}
 */
export async function logout() {
  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut error:', err);
    }
  }
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * Attaches a listener to Supabase authentication state changes
 * @param {Function} callback
 * @returns {Function} unsubscribe function
 */
export function onAuthStateChange(callback) {
  if (!isSupabaseConfigured) return () => {};

  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      const user = formatSupabaseUser(session.user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      callback(user, event);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      callback(null, event);
    }
  });

  return () => {
    subscription.unsubscribe();
  };
}
