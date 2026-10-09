// paradu'l — Authentication View (Sign In & Sign Up)

import { useState } from 'react';
import { IconShirt, IconCheck } from './common/Icons.jsx';

export default function Login({ onLoginSuccess, onSignUpSuccess }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      if (authMode === 'signup' && onSignUpSuccess) {
        await onSignUpSuccess(email, password, name);
      } else {
        await onLoginSuccess(email, password, rememberMe);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card-container">
        {/* Brand identity header */}
        <div className="login-brand-header">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="paradu'l" className="login-logo-img" />
          <p className="login-app-subtitle">
            Curate your digital wardrobe, craft timeless outfits, and elevate your personal style.
          </p>
        </div>

        {/* Auth Mode Toggle Tabs (Sign In vs Sign Up) */}
        <div className="auth-mode-tabs" role="tablist">
          <button
            type="button"
            className={`auth-mode-tab-btn ${authMode === 'signin' ? 'active' : ''}`}
            onClick={() => {
              setAuthMode('signin');
              setErrorMessage('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-mode-tab-btn ${authMode === 'signup' ? 'active' : ''}`}
            onClick={() => {
              setAuthMode('signup');
              setErrorMessage('');
            }}
          >
            Create Account
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

        {/* Auth form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {authMode === 'signup' && (
            <div className="form-group">
              <label htmlFor="login-name">Full Name</label>
              <input
                id="login-name"
                type="text"
                placeholder="e.g. Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                autoComplete="name"
              />
            </div>
          )}

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
              {authMode === 'signin' && (
                <button
                  type="button"
                  className="btn-forgot-password"
                  onClick={() => setInfoMessage('If you forgot your password, please reset it via your Supabase dashboard or registered email.')}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              id="login-password"
              type="password"
              placeholder={authMode === 'signup' ? 'At least 6 characters' : '••••••••'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
            />
          </div>

          {authMode === 'signin' && (
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
          )}

          <button
            type="submit"
            className="btn-primary-large"
            disabled={isLoading}
          >
            {isLoading
              ? authMode === 'signup'
                ? 'Creating account...'
                : 'Signing in...'
              : authMode === 'signup'
              ? 'Create paradu\'l Account'
              : 'Sign In to paradu\'l'}
          </button>
        </form>

        <footer className="login-card-footer">
          <p className="signup-prompt">
            {authMode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="btn-link-action"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage('');
                  }}
                >
                  Create one now
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="btn-link-action"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMessage('');
                  }}
                >
                  Sign in here
                </button>
              </>
            )}
          </p>
        </footer>
      </div>
    </div>
  );
}
