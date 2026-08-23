import React, { useState, useEffect } from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import { Board } from './components/Board';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('collabboard_current_user');
    if (user) {
      try {
        setCurrentUser(JSON.parse(user));
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('collabboard_current_user');
      }
    }
  }, []);

  // User management functions
  const getUsers = () => {
    try {
      const users = localStorage.getItem('collabboard_users');
      return users ? JSON.parse(users) : [];
    } catch (e) {
      return [];
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem('collabboard_users', JSON.stringify(users));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login Logic
      const users = getUsers();
      const user = users.find(
        u => u.email === formData.email && u.password === formData.password
      );
      
      if (user) {
        localStorage.setItem('collabboard_current_user', JSON.stringify(user));
        setCurrentUser(user);
        setIsAuthenticated(true);
        // Reset form
        setFormData({ email: '', password: '', name: '', confirmPassword: '' });
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } else {
      // Register Logic
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match!');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      if (!formData.name.trim()) {
        setError('Please enter your full name.');
        return;
      }

      const users = getUsers();
      if (users.find(u => u.email === formData.email)) {
        setError('An account with this email already exists.');
        return;
      }

      const newUser = {
        id: Date.now(),
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);
      
      localStorage.setItem('collabboard_current_user', JSON.stringify(newUser));
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      // Reset form
      setFormData({ email: '', password: '', name: '', confirmPassword: '' });
    }
  };

  const handleDemoLogin = () => {
    const users = getUsers();
    const demoUser = {
      id: 999,
      name: 'Demo User',
      email: 'demo@collabboard.com',
      password: 'demo123'
    };
    
    if (!users.find(u => u.email === 'demo@collabboard.com')) {
      users.push(demoUser);
      saveUsers(users);
    }
    
    localStorage.setItem('collabboard_current_user', JSON.stringify(demoUser));
    setCurrentUser(demoUser);
    setIsAuthenticated(true);
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('collabboard_current_user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    // Reset form to login mode
    setIsLogin(true);
    setError('');
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
  };

  // Login Page
  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <i className="fas fa-columns"></i> CollabBoard
            </div>
            <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
            <p>{isLogin ? 'Sign in to manage your tasks' : 'Start managing your team tasks'}</p>
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
               
                <input
                  type="password"
                  name="password"
                  placeholder={isLogin ? 'Enter your password' : 'Create a password (min 6 chars)'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                 
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <button type="submit" className="login-btn">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={toggleMode} className="toggle-btn" type="button">
                {isLogin ? ' Sign Up' : ' Sign In'}
              </button>
            </p>
          </div>

          <div className="login-demo">
            <p>Quick Demo Access</p>
            <button className="demo-btn" onClick={handleDemoLogin} type="button">
              <i className="fas fa-rocket"></i> Try CollabBoard Now
            </button>
            <div className="demo-credentials">
              <span>📧 demo@collabboard.com</span>
              <span>🔑 demo123</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="app">
      <Navbar user={currentUser} onLogout={handleLogout} />
      <Board />
      <div className="footer">
        <i className="fas fa-sitemap"></i> Component tree: App → Board → Column → TaskCard · mock data with localStorage
      </div>
    </div>
  );
}

export default App;