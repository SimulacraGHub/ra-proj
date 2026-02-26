import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Home } from './Pages/Home';
import { About } from './Pages/About';
import { Contact } from './Pages/Contact';
import { Weather } from './Pages/Weather';


export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      {/* Top-right menu */}
      <nav className="nav-bar">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {/* Burger menu */}
        <div className="burger-menu">
          <button className="burger-btn" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          {menuOpen && (
            <div className="burger-dropdown">
              <Link to="/weather" onClick={() => setMenuOpen(false)}>Weather</Link>
              <Link to="/placeholder" onClick={() => setMenuOpen(false)}>Placeholder</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/placeholder" element={<div>Placeholder Page</div>} />
      </Routes>
    </div>
  );
}