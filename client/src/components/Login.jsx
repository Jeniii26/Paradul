/**
 * paradu'l — Mock Login View
 *
 * DEVELOPER NOTE:
 * This login screen demonstrates the authentication user journey in the local prototype.
 * It uses local React state and browser localStorage.
 * Supabase Auth will replace this implementation in a future phase with real JWT tokens
 * and database sessions.
 */

import { useState } from 'react';
import { DEMO_USER } from '../services/authService.js';
import { IconShirt, IconSparkles } from './common/Icons.jsx';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('demo@paradul.com');
  const [password, setPassword] = useState('paradul123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');
    setIsLoading(true);

    try {
      await onLoginSuccess(email, password, rememberMe);
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDemoAccount = () => {
    setEmail(DEMO_USER.email);
    setPassword('paradul123');
    setInfoMessage('Filled demo credentials: demo@paradul.com');
  };

  return (
    <div className="login-page">
      <div className="login-card-container">
        {/* Brand identity header */}
        <div className="login-brand-header">
          <div className="login-logo-mark">
            <IconShirt size={28} />
          </div>
          <h1 className="login-app-title">paradu'l</h1>
          <p className="login-app-subtitle">
            Curate your digital wardrobe, craft timeless outfits, and elevate your personal style.
          </p>
        </div>

        {/* Temporary prototype notice */}
        <div className="mock-auth-notice" role="note">
          <span className="notice-badge">Prototype Mode</span>
          <p>
            Local mock authentication is active. You may log in with any valid email and password,
            or click below to use the pre-configured demo account.
          </p>
          <button
            type="button"
            className="btn-link-action"
            onClick={handleUseDemoAccount}
          >
            <IconSparkles size={14} />
            <span>Use Demo Account (demo@paradul.com)</span>
          </button>
        </div>

        {/* Error / Info messages */}
        {errorMessage && (
          <div className="login-alert error" role="alert">
            {errorMessage}
          </div>
        )}
        {infoMessage && (
          <div className="login-alert info" role="status">
            {infoMessage}
          </div>
        )}

        {/* Login form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="e.g. style@paradul.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="login-password">Password</label>
              <button
                type="button"
                className="btn-forgot-password"
                onClick={() => setInfoMessage('Demo mode: Any password with at least 4 characters is accepted.')}
              >
                Forgot password?
              </button>
            </div>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="form-checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span>Remember me on this browser</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary-large"
            disabled={isLoading}
          >
            {isLoading ? 'Entering wardrobe...' : 'Enter paradu\'l'}
          </button>
        </form>

        <footer className="login-card-footer">
          <p className="signup-prompt">
            Don't have an account?{' '}
            <button
              type="button"
              className="btn-link-action"
              onClick={() => setInfoMessage('In prototype mode, any new email automatically signs in!')}
            >
              Sign up for early access
            </button>
          </p>
          <p className="future-supabase-comment">
            /* Note: Supabase Auth integration scheduled for upcoming phase */
          </p>
        </footer>
      </div>
    </div>
  );
}
