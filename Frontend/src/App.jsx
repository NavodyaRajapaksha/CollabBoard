import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Board } from './components/Board';
import { Login, Register } from './components/Auth';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('collabboard_current_user')) || null; }
    catch { return null; }
  });
  const [authPage, setAuthPage] = useState('login');

  const handleLogin = (loggedInUser) => {
    localStorage.setItem('collabboard_current_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const handleRegister = (newUser) => {
    localStorage.setItem('collabboard_current_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('collabboard_current_user');
    setUser(null);
    setAuthPage('login');
  };

  if (!user) {
    return authPage === 'register'
      ? <Register onRegister={handleRegister} onShowLogin={() => setAuthPage('login')} />
      : <Login onLogin={handleLogin} onShowRegister={() => setAuthPage('register')} />;
  }

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />
      <Board />
      <div className="footer">
        <i className="fas fa-sitemap"></i> CollabBoard | Group 20 | FullStack
      </div>
    </div>
  );
}

export default App;
