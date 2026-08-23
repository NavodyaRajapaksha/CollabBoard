import React from 'react';
import './Navbar.css';

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <i className="fas fa-columns"></i> CollabBoard
      </div>
      <div className="user-badge">
        <span>
          <i className="fas fa-user-circle" style={{ marginRight: '6px' }}></i>
          Alex
        </span>
        <span className="btn-outline">
          <i className="fas fa-sign-out-alt"></i> logout
        </span>
      </div>
    </nav>
  );
}