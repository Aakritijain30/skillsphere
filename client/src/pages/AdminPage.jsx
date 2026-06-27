import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'https://skillsphere-server-3b4k.onrender.com/api';

function AdminPage() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Check if admin
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          axios.get(`${API}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        alert('Access denied. Admin only.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, token, navigate]);

  const handleSuspend = async (userId) => {
    try {
      await axios.put(`${API}/admin/suspend/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u._id === userId ? { ...u, isSuspended: true } : u));
      alert('User suspended!');
    } catch (err) {
      alert('Error suspending user');
    }
  };

  const handleVerify = async (userId) => {
    try {
      await axios.put(`${API}/admin/verify/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Freelancer verified!');
    } catch (err) {
      alert('Error verifying freelancer');
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '20px' }}>
      Loading admin panel...
    </div>
  );

  return (
    <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ color: '#1a1a2e', marginBottom: '25px' }}>Admin Dashboard</h1>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{
            background: '#3498db', color: 'white',
            padding: '25px', borderRadius: '10px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold' }}>{stats.users}</div>
            <div style={{ fontSize: '16px', marginTop: '5px' }}>Total Users</div>
          </div>
          <div style={{
            background: '#2ecc71', color: 'white',
            padding: '25px', borderRadius: '10px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold' }}>{stats.gigs}</div>
            <div style={{ fontSize: '16px', marginTop: '5px' }}>Total Gigs</div>
          </div>
          <div style={{
            background: '#f39c12', color: 'white',
            padding: '25px', borderRadius: '10px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold' }}>₹{stats.revenue}</div>
            <div style={{ fontSize: '16px', marginTop: '5px' }}>Total Revenue</div>
          </div>
        </div>
      )}

      <div style={{
        background: 'white', borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '25px'
      }}>
        <h2 style={{ color: '#1a1a2e', marginBottom: '20px' }}>All Users ({users.length})</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f0f2f5' }}>
                {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '12px 15px', textAlign: 'left',
                    color: '#555', fontWeight: '600', fontSize: '14px'
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 15px', color: '#1a1a2e', fontWeight: '500' }}>
                    {u.name}
                  </td>
                  <td style={{ padding: '12px 15px', color: '#666' }}>{u.email}</td>
                  <td style={{ padding: '12px 15px' }}>
                    <span style={{
                      background: u.role === 'admin' ? '#e74c3c' : u.role === 'freelancer' ? '#3498db' : '#2ecc71',
                      color: 'white', padding: '3px 10px', borderRadius: '15px', fontSize: '12px'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 15px' }}>
                    <span style={{
                      background: u.isSuspended ? '#e74c3c' : '#2ecc71',
                      color: 'white', padding: '3px 10px', borderRadius: '15px', fontSize: '12px'
                    }}>
                      {u.isSuspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 15px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!u.isSuspended && u.role !== 'admin' && (
                        <button onClick={() => handleSuspend(u._id)} style={{
                          background: '#e74c3c', color: 'white', border: 'none',
                          padding: '5px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px'
                        }}>
                          Suspend
                        </button>
                      )}
                      {u.role === 'freelancer' && (
                        <button onClick={() => handleVerify(u._id)} style={{
                          background: '#3498db', color: 'white', border: 'none',
                          padding: '5px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px'
                        }}>
                          Verify
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;