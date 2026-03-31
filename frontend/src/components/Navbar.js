import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo" onClick={closeMenu}>
          📖 StoriesOfUs
        </Link>

        {/* Hamburger button – mobile only */}
        <button
          className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Nav links */}
        <ul className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/stories" onClick={closeMenu}>All Stories</Link></li>
          {user && <li><Link to="/chat" onClick={closeMenu}>💬 Chat</Link></li>}
          <li>
            <Link to="/submit" className="btn btn-primary" onClick={closeMenu}>
              Share Your Story
            </Link>
          </li>
          {user ? (
            <>
              <li className="nav-user">
                👤 {user.name}
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li><Link to="/login" className="btn btn-secondary" onClick={closeMenu}>Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

