import React from 'react';
import './Navbar.css';

export function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="logo"><i className="fas fa-columns"></i> CollabBoard</div>
      <div className="user-badge">
        <span><i className="fas fa-user-circle" style={{ marginRight: '6px' }}></i>{user?.name || 'User'}</span>
        <button className="btn-outline" onClick={onLogout}><i className="fas fa-sign-out-alt"></i> logout</button>
      </div>
    </nav>
  );
}
