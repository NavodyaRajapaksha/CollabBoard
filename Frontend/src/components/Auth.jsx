import React, { useState } from 'react';
import { authApi } from '../services/api';
import './Auth.css';

export function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authApi.login(email.trim(), password);
      onLogin(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return <AuthLayout title="Welcome back" subtitle="Sign in to continue to your CollabBoard workspace">
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group"><label htmlFor="login-email">Email</label><input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
      <div className="form-group"><label htmlFor="login-password">Password</label><input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required /></div>
      {error && <div className="auth-error">{error}</div>}
      <button className="btn-primary auth-submit" type="submit" disabled={loading}><i className="fas fa-sign-in-alt"></i> {loading ? 'Signing in...' : 'Sign in'}</button>
    </form>
    <div className="auth-switch">Don't have an account?<button type="button" onClick={onShowRegister}>Create one</button></div>
  </AuthLayout>;
}

export function Register({ onRegister, onShowLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const result = await authApi.register(name.trim(), email.trim(), password);
      onRegister(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return <AuthLayout title="Create your account" subtitle="Join your team and start collaborating">
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group"><label htmlFor="register-name">Full name</label><input id="register-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required /></div>
      <div className="form-group"><label htmlFor="register-email">Email</label><input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
      <div className="form-group"><label htmlFor="register-password">Password</label><input id="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required /></div>
      <div className="form-group"><label htmlFor="register-confirm">Confirm password</label><input id="register-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" required /></div>
      {error && <div className="auth-error">{error}</div>}
      <button className="btn-primary auth-submit" type="submit" disabled={loading}><i className="fas fa-user-plus"></i> {loading ? 'Creating account...' : 'Create account'}</button>
    </form>
    <div className="auth-switch">Already have an account?<button type="button" onClick={onShowLogin}>Sign in</button></div>
  </AuthLayout>;
}

function AuthLayout({ title, subtitle, children }) {
  return <div className="auth-page"><div className="auth-card">
    <div className="auth-brand"><div className="brand-icon"><i className="fas fa-columns"></i></div><h1>{title}</h1><p>{subtitle}</p></div>
    {children}
  </div></div>;
}
