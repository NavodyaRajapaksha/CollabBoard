import React from 'react';
import { Navbar } from './components/Navbar';
import { Board } from './components/Board';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <Board />
      <div className="footer">
        <i className="fas fa-sitemap"></i> CollabBoaard | Group 20 | FullStack
      </div>
    </div>
  );
}

export default App;