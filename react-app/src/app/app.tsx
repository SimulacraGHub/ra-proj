import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Home } from './Pages/Home';

export default function App() {
  return (
    <div>
      {/* Top-right menu */}
      <nav style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem', gap: '1rem' }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/contact" element={<div>Contact Page</div>} />
      </Routes>
    </div>
  );
}
