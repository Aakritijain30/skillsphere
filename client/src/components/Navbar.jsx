import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav style={{
      background: '#1a1a2e',
      padding: '15px 20px',
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '22px', fontWeight: 'bold' }}>
          SkillSphere
        </Link>

        {/* Hamburger button - mobile only */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            width: 'auto',
          }}
          className="hamburger"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* Desktop menu */}
        <div className="desktop-menu" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Gigs</Link>
          {user ? (
            <>
              <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
              <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
              <Link to="/notifications" style={{ color: 'white', textDecoration: 'none' }}>🔔</Link>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin</Link>
              )}
              <span style={{ color: '#a0a0a0' }}>Hi, {user.name}</span>
              <button onClick={handleLogout} style={{
                background: '#e74c3c', color: 'white', border: 'none',
                padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', width: 'auto'
              }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{
                background: '#3498db', color: 'white', textDecoration: 'none',
                padding: '8px 16px', borderRadius: '5px'
              }}>Register</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '15px',
          paddingTop: '15px', borderTop: '1px solid #ffffff20', marginTop: '15px'
        }}>
          <Link to="/" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>Gigs</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
              <Link to="/notifications" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>🔔 Notifications</Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>Admin</Link>
              )}
              <span style={{ color: '#a0a0a0' }}>Hi, {user.name}</span>
              <button onClick={handleLogout} style={{
                background: '#e74c3c', color: 'white', border: 'none',
                padding: '10px', borderRadius: '5px', cursor: 'pointer', width: '100%'
              }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{
                background: '#3498db', color: 'white', textDecoration: 'none',
                padding: '10px', borderRadius: '5px', textAlign: 'center'
              }}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;