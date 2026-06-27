import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    const result = await dispatch(register(form));
    setLoading(false);
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    } else {
      setError(result.payload || 'Something went wrong');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f2f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1a1a2e' }}>
          SkillSphere Register
        </h2>
        {error && (
          <div style={{
            background: '#ffe0e0', color: '#e74c3c',
            padding: '10px', borderRadius: '5px', marginBottom: '15px'
          }}>
            {error}
          </div>
        )}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{
              width: '100%', padding: '10px', border: '1px solid #ddd',
              borderRadius: '5px', fontSize: '14px', boxSizing: 'border-box'
            }}
            placeholder="Your name"
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{
              width: '100%', padding: '10px', border: '1px solid #ddd',
              borderRadius: '5px', fontSize: '14px', boxSizing: 'border-box'
            }}
            placeholder="Your email"
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{
              width: '100%', padding: '10px', border: '1px solid #ddd',
              borderRadius: '5px', fontSize: '14px', boxSizing: 'border-box'
            }}
            placeholder="Your password"
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            style={{
              width: '100%', padding: '10px', border: '1px solid #ddd',
              borderRadius: '5px', fontSize: '14px', boxSizing: 'border-box'
            }}
          >
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '12px', background: '#2ecc71',
            color: 'white', border: 'none', borderRadius: '5px',
            fontSize: '16px', cursor: 'pointer'
          }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#555' }}>
          Already have an account? <Link to="/login" style={{ color: '#3498db' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;