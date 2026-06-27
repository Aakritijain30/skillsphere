import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = 'https://skillsphere-server-3b4k.onrender.com/api';

function GigListPage() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: '',
    skills: '', budgetMin: '', budgetMax: ''
  });
  const token = localStorage.getItem('token');

  const fetchGigs = async () => {
    try {
      const res = await axios.get(`${API}/gigs`);
      setGigs(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGigs(); }, []);

  const handlePostGig = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/gigs`, {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setForm({ title: '', description: '', category: '', skills: '', budgetMin: '', budgetMax: '' });
      fetchGigs();
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting gig');
    }
  };

  const filtered = gigs.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === '' || g.category === category)
  );

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '20px' }}>
      Loading gigs...
    </div>
  );

  return (
    <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ color: '#1a1a2e' }}>Available Gigs</h1>
        {token && (
          <button onClick={() => setShowForm(!showForm)} style={{
            background: '#2ecc71', color: 'white', border: 'none',
            padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap'
          }}>
            {showForm ? 'Cancel' : '+ Post Gig'}
          </button>
        )}
      </div>

      {showForm && (
        <div style={{
          background: 'white', padding: '25px', borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '25px'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Post a New Gig</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {[
              { label: 'Title', key: 'title' },
              { label: 'Category', key: 'category' },
              { label: 'Skills (comma separated)', key: 'skills' },
              { label: 'Min Budget (₹)', key: 'budgetMin' },
              { label: 'Max Budget (₹)', key: 'budgetMax' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>{field.label}</label>
                <input
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  style={{
                    width: '100%', padding: '10px', border: '1px solid #ddd',
                    borderRadius: '5px', boxSizing: 'border-box'
                  }}
                />
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                style={{
                  width: '100%', padding: '10px', border: '1px solid #ddd',
                  borderRadius: '5px', boxSizing: 'border-box', resize: 'vertical'
                }}
              />
            </div>
          </div>
          <button onClick={handlePostGig} style={{
            marginTop: '15px', background: '#3498db', color: 'white',
            border: 'none', padding: '12px 25px', borderRadius: '8px',
            cursor: 'pointer', fontSize: '15px'
          }}>
            Submit Gig
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search gigs..."
          style={{
            flex: 1, padding: '12px', border: '1px solid #ddd',
            borderRadius: '8px', fontSize: '15px'
          }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: '12px', border: '1px solid #ddd',
            borderRadius: '8px', fontSize: '15px'
          }}
        >
          <option value="">All Categories</option>
          <option value="Web Development">Web Development</option>
          <option value="Mobile Development">Mobile Development</option>
          <option value="Design">Design</option>
          <option value="Writing">Writing</option>
          <option value="Marketing">Marketing</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
          <div style={{ fontSize: '50px' }}>📭</div>
          <h3>No gigs found</h3>
          <p>Be the first to post a gig!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map(gig => (
            <div key={gig._id} style={{
              background: 'white', borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden'
            }}>
              <div style={{ background: '#1a1a2e', padding: '15px 20px' }}>
                <span style={{
                  background: '#3498db', color: 'white',
                  padding: '3px 10px', borderRadius: '20px', fontSize: '12px'
                }}>
                  {gig.category || 'General'}
                </span>
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ color: '#1a1a2e', marginBottom: '10px' }}>{gig.title}</h3>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px', lineHeight: '1.5' }}>
                  {gig.description?.substring(0, 100)}...
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                  {gig.skills?.map((skill, i) => (
                    <span key={i} style={{
                      background: '#f0f2f5', color: '#555',
                      padding: '4px 10px', borderRadius: '15px', fontSize: '12px'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '16px' }}>
                    ₹{gig.budgetMin} - ₹{gig.budgetMax}
                  </span>
                  <Link to={`/gigs/${gig._id}`} style={{
                    background: '#3498db', color: 'white', textDecoration: 'none',
                    padding: '8px 16px', borderRadius: '5px', fontSize: '14px'
                  }}>
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GigListPage;