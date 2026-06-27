import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#1a1a2e', padding: '15px 30px',
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', color: 'white'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '22px', fontWeight: 'bold' }}>
        SkillSphere
      </Link>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Gigs</Link>
        {user ? (
          <>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
            <Link to="/payment" style={{ color: 'white', textDecoration: 'none' }}>💳 Pay</Link>
            <Link to="/notifications" style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}>🔔</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin</Link>
            )}
            <span style={{ color: '#a0a0a0' }}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={{
              background: '#e74c3c', color: 'white', border: 'none',
              padding: '8px 16px', borderRadius: '5px', cursor: 'pointer'
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
    </nav>
  );
}

export default Navbar;