import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import axios from 'axios';

const API = 'https://skillsphere-server-3b4k.onrender.com/api';

function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ bio: '', hourlyRate: '', availability: 'available' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
        if (res.data) {
          setForm({
            bio: res.data.bio || '',
            hourlyRate: res.data.hourlyRate || '',
            availability: res.data.availability || 'available'
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${API}/profile/me`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setEditing(false);
      alert('Profile updated!');
    } catch (err) {
      alert('Error updating profile');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${API}/auth/delete`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(logout());
      navigate('/register');
      alert('Account deleted successfully!');
    } catch (err) {
      alert('Error deleting account');
    }
  };

  if (!user) return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Please login first</h2>
    </div>
  );

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>

      {/* User Info Card */}
      <div style={{
        background: 'white', borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '30px', marginBottom: '25px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: '#1a1a2e', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '32px', color: 'white'
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ color: '#1a1a2e', marginBottom: '5px' }}>{user.name}</h2>
            <p style={{ color: '#666', marginBottom: '5px' }}>{user.email}</p>
            <span style={{
              background: user.role === 'freelancer' ? '#3498db' : user.role === 'admin' ? '#e74c3c' : '#2ecc71',
              color: 'white', padding: '3px 12px', borderRadius: '15px', fontSize: '13px'
            }}>
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Freelancer Profile */}
      {user.role === 'freelancer' && (
        <div style={{
          background: 'white', borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '30px', marginBottom: '25px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#1a1a2e' }}>Freelancer Profile</h2>
            <button onClick={() => setEditing(!editing)} style={{
              background: editing ? '#e74c3c' : '#3498db',
              color: 'white', border: 'none',
              padding: '8px 18px', borderRadius: '8px', cursor: 'pointer'
            }}>
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editing ? (
            <div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={4}
                  style={{
                    width: '100%', padding: '10px', border: '1px solid #ddd',
                    borderRadius: '5px', boxSizing: 'border-box', resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Hourly Rate (₹)</label>
                  <input
                    type="number"
                    value={form.hourlyRate}
                    onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                    style={{
                      width: '100%', padding: '10px', border: '1px solid #ddd',
                      borderRadius: '5px', boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Availability</label>
                  <select
                    value={form.availability}
                    onChange={(e) => setForm({ ...form, availability: e.target.value })}
                    style={{
                      width: '100%', padding: '10px', border: '1px solid #ddd',
                      borderRadius: '5px', boxSizing: 'border-box'
                    }}
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
              <button onClick={handleUpdate} style={{
                background: '#2ecc71', color: 'white', border: 'none',
                padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px'
              }}>
                Save Profile
              </button>
            </div>
          ) : (
            <div>
              {profile ? (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: '#999', marginBottom: '8px' }}>Bio</h4>
                    <p style={{ color: '#555', lineHeight: '1.7' }}>
                      {profile.bio || 'No bio added yet'}
                    </p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ background: '#f0f2f5', padding: '15px', borderRadius: '8px' }}>
                      <h4 style={{ color: '#999', marginBottom: '5px' }}>Hourly Rate</h4>
                      <p style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '20px' }}>
                        ₹{profile.hourlyRate || 0}/hr
                      </p>
                    </div>
                    <div style={{ background: '#f0f2f5', padding: '15px', borderRadius: '8px' }}>
                      <h4 style={{ color: '#999', marginBottom: '5px' }}>Availability</h4>
                      <p style={{
                        color: profile.availability === 'available' ? '#2ecc71' : '#e74c3c',
                        fontWeight: 'bold', fontSize: '16px'
                      }}>
                        {profile.availability}
                      </p>
                    </div>
                    <div style={{ background: '#f0f2f5', padding: '15px', borderRadius: '8px' }}>
                      <h4 style={{ color: '#999', marginBottom: '5px' }}>Rating</h4>
                      <p style={{ color: '#f39c12', fontWeight: 'bold', fontSize: '20px' }}>
                        ⭐ {profile.rating || 0} / 5
                      </p>
                    </div>
                    <div style={{ background: '#f0f2f5', padding: '15px', borderRadius: '8px' }}>
                      <h4 style={{ color: '#999', marginBottom: '5px' }}>Total Reviews</h4>
                      <p style={{ color: '#3498db', fontWeight: 'bold', fontSize: '20px' }}>
                        {profile.reviewCount || 0}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ color: '#999' }}>No profile found. Click Edit to create one.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Client Profile */}
      {user.role === 'client' && (
        <div style={{
          background: 'white', borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '30px', marginBottom: '25px'
        }}>
          <h2 style={{ color: '#1a1a2e', marginBottom: '15px' }}>Client Account</h2>
          <p style={{ color: '#666' }}>
            You are registered as a client. You can post gigs and hire freelancers.
          </p>
        </div>
      )}

      {/* Delete Account */}
      <div style={{
        background: 'white', borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '25px'
      }}>
        <h3 style={{ color: '#e74c3c', marginBottom: '10px' }}>Danger Zone</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Once you delete your account, there is no going back.
        </p>

        {!showDeleteConfirm ? (
          <button onClick={() => setShowDeleteConfirm(true)} style={{
            background: 'white', color: '#e74c3c', border: '2px solid #e74c3c',
            padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
          }}>
            Delete My Account
          </button>
        ) : (
          <div style={{
            background: '#ffe0e0', padding: '20px',
            borderRadius: '8px', border: '1px solid #e74c3c'
          }}>
            <p style={{ color: '#e74c3c', fontWeight: 'bold', marginBottom: '15px' }}>
              Are you sure? This cannot be undone!
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleDeleteAccount} style={{
                background: '#e74c3c', color: 'white', border: 'none',
                padding: '10px 20px', borderRadius: '8px', cursor: 'pointer'
              }}>
                Yes, Delete My Account
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} style={{
                background: '#666', color: 'white', border: 'none',
                padding: '10px 20px', borderRadius: '8px', cursor: 'pointer'
              }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default ProfilePage;