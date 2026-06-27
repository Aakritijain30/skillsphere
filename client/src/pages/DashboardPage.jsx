import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Please login first</h2>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#1a1a2e', marginBottom: '10px' }}>
        Welcome, {user.name}!
      </h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Role: <strong>{user.role}</strong>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>

        {user.role === 'client' && (
          <>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#3498db', color: 'white', padding: '25px',
                borderRadius: '10px', textAlign: 'center', cursor: 'pointer'
              }}>
                <div style={{ fontSize: '40px' }}>🔍</div>
                <h3>Browse Gigs</h3>
                <p>Find freelancers</p>
              </div>
            </Link>
            <Link to="/post-gig" style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#2ecc71', color: 'white', padding: '25px',
                borderRadius: '10px', textAlign: 'center', cursor: 'pointer'
              }}>
                <div style={{ fontSize: '40px' }}>➕</div>
                <h3>Post a Gig</h3>
                <p>Start a new project</p>
              </div>
            </Link>
          </>
        )}

        {user.role === 'freelancer' && (
          <>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#3498db', color: 'white', padding: '25px',
                borderRadius: '10px', textAlign: 'center', cursor: 'pointer'
              }}>
                <div style={{ fontSize: '40px' }}>💼</div>
                <h3>Browse Gigs</h3>
                <p>Find work</p>
              </div>
            </Link>
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#9b59b6', color: 'white', padding: '25px',
                borderRadius: '10px', textAlign: 'center', cursor: 'pointer'
              }}>
                <div style={{ fontSize: '40px' }}>👤</div>
                <h3>My Profile</h3>
                <p>Update your profile</p>
              </div>
            </Link>
          </>
        )}

        {user.role === 'admin' && (
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#e74c3c', color: 'white', padding: '25px',
              borderRadius: '10px', textAlign: 'center', cursor: 'pointer'
            }}>
              <div style={{ fontSize: '40px' }}>⚙️</div>
              <h3>Admin Panel</h3>
              <p>Manage everything</p>
            </div>
          </Link>
        )}

        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <div style={{
            background: '#f39c12', color: 'white', padding: '25px',
            borderRadius: '10px', textAlign: 'center', cursor: 'pointer'
          }}>
            <div style={{ fontSize: '40px' }}>⭐</div>
            <h3>My Profile</h3>
            <p>View your profile</p>
          </div>
        </Link>

      </div>
    </div>
  );
}

export default DashboardPage;