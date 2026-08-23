import React, { useState } from 'react';
import './Auth.css';

const USERS_KEY = 'collabboard_users';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}

export function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const user = getUsers().find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password
    );
    if (!user) {
      setError('Incorrect email or password.');
      return;
    }
    onLogin(user);
  };

  return <AuthLayout title="Welcome back" subtitle="Sign in to continue to your CollabBoard workspace">
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group"><label htmlFor="login-email">Email</label><input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
      <div className="form-group"><label htmlFor="login-password">Password</label><input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required /></div>
      {error && <div className="auth-error">{error}</div>}
      <button className="btn-primary auth-submit" type="submit"><i className="fas fa-sign-in-alt"></i> Sign in</button>
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    const users = getUsers();
    if (users.some((item) => item.email.toLowerCase() === email.trim().toLowerCase())) {
      return setError('An account with this email already exists.');
    }
    const user = { id: Date.now(), name: name.trim(), email: email.trim(), password };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
    onRegister(user);
  };

  return <AuthLayout title="Create your account" subtitle="Join your team and start collaborating">
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group"><label htmlFor="register-name">Full name</label><input id="register-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required /></div>
      <div className="form-group"><label htmlFor="register-email">Email</label><input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
      <div className="form-group"><label htmlFor="register-password">Password</label><input id="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required /></div>
      <div className="form-group"><label htmlFor="register-confirm">Confirm password</label><input id="register-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" required /></div>
      {error && <div className="auth-error">{error}</div>}
      <button className="btn-primary auth-submit" type="submit"><i className="fas fa-user-plus"></i> Create account</button>
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
