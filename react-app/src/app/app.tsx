import React, { useState, useRef } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Home } from './Pages/Home';
import { About } from './Pages/About';
import { Contact } from './Pages/Contact';
import { Weather } from './Pages/Weather';
import { Music } from './Pages/Music';
import { useOutsideClick } from './hooks/useOutsideClick';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setMenuOpen(false), menuOpen);

  return (
    <div>
      <nav className="nav-bar">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        <div className="burger-menu" ref={dropdownRef}>
          <button className="burger-btn" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          {menuOpen && (
            <div className="burger-dropdown">
              <Link to="/weather" onClick={() => setMenuOpen(false)}>
                Weather
              </Link>
              <Link to="/music" onClick={() => setMenuOpen(false)}>
                Music
              </Link>
            </div>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/music" element={<Music />} />
      </Routes>
    </div>
  );
}
