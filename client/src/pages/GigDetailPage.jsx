import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API = 'https://skillsphere-server-3b4k.onrender.com/api';

function GigDetailPage() {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ description: '', bidAmount: '', estimatedDays: '' });
  const [submitted, setSubmitted] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await axios.get(`${API}/gigs/${id}`);
        setGig(res.data);
        if (token) {
          const pRes = await axios.get(`${API}/proposals/gig/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProposals(pRes.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [id, token]);

  const handleProposal = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/proposals/gig/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmitted(true);
      alert('Proposal submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting proposal');
    }
  };

  const handleAccept = async (proposalId) => {
    try {
      await axios.put(`${API}/proposals/${proposalId}`, { status: 'accepted' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProposals(proposals.map(p =>
        p._id === proposalId ? { ...p, status: 'accepted' } : p
      ));
      alert('Proposal accepted!');
    } catch (err) {
      alert('Error accepting proposal');
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '20px' }}>
      Loading...
    </div>
  );

  if (!gig) return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Gig not found</h2>
    </div>
  );

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>

      <div style={{
        background: 'white', borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '30px', marginBottom: '25px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{
              background: '#3498db', color: 'white',
              padding: '4px 12px', borderRadius: '20px', fontSize: '13px'
            }}>
              {gig.category || 'General'}
            </span>
            <h1 style={{ color: '#1a1a2e', margin: '15px 0 10px' }}>{gig.title}</h1>
          </div>
          <span style={{
            background: gig.status === 'open' ? '#2ecc71' : '#e74c3c',
            color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '14px'
          }}>
            {gig.status}
          </span>
        </div>

        <p style={{ color: '#555', lineHeight: '1.7', marginBottom: '20px' }}>
          {gig.description}
        </p>

        <div style={{ display: 'flex', gap: '30px', marginBottom: '20px' }}>
          <div>
            <span style={{ color: '#999', fontSize: '13px' }}>Budget</span>
            <div style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '18px' }}>
              ₹{gig.budgetMin} - ₹{gig.budgetMax}
            </div>
          </div>
          <div>
            <span style={{ color: '#999', fontSize: '13px' }}>Posted by</span>
            <div style={{ color: '#1a1a2e', fontWeight: 'bold' }}>
              {gig.client?.name}
            </div>
            {token && user?._id !== gig.client?._id && (
              <Link to={`/chat/${gig.client?._id}`} style={{
                background: '#3498db', color: 'white', textDecoration: 'none',
                padding: '6px 14px', borderRadius: '5px', fontSize: '13px',
                display: 'inline-block', marginTop: '8px'
              }}>
                💬 Chat
              </Link>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {gig.skills?.map((skill, i) => (
            <span key={i} style={{
              background: '#f0f2f5', color: '#555',
              padding: '5px 12px', borderRadius: '15px', fontSize: '13px'
            }}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      {token && !submitted && (
        <div style={{
          background: 'white', borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '30px', marginBottom: '25px'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#1a1a2e' }}>Submit Your Proposal</h2>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
              Cover Letter
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              style={{
                width: '100%', padding: '10px', border: '1px solid #ddd',
                borderRadius: '5px', boxSizing: 'border-box', resize: 'vertical'
              }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                Bid Amount (₹)
              </label>
              <input
                type="number"
                value={form.bidAmount}
                onChange={(e) => setForm({ ...form, bidAmount: e.target.value })}
                style={{
                  width: '100%', padding: '10px', border: '1px solid #ddd',
                  borderRadius: '5px', boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                Estimated Days
              </label>
              <input
                type="number"
                value={form.estimatedDays}
                onChange={(e) => setForm({ ...form, estimatedDays: e.target.value })}
                style={{
                  width: '100%', padding: '10px', border: '1px solid #ddd',
                  borderRadius: '5px', boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
          <button onClick={handleProposal} style={{
            background: '#3498db', color: 'white', border: 'none',
            padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px'
          }}>
            Submit Proposal
          </button>
        </div>
      )}

      {submitted && (
        <div style={{
          background: '#d4edda', color: '#155724', padding: '15px',
          borderRadius: '8px', marginBottom: '25px', textAlign: 'center'
        }}>
          Proposal submitted successfully!
        </div>
      )}

      {proposals.length > 0 && (
        <div style={{
          background: 'white', borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '30px'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#1a1a2e' }}>
            Proposals ({proposals.length})
          </h2>
          {proposals.map(p => (
            <div key={p._id} style={{
              border: '1px solid #eee', borderRadius: '8px',
              padding: '20px', marginBottom: '15px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                  <strong>{p.freelancer?.name}</strong>
                  <span style={{ color: '#999', fontSize: '13px', marginLeft: '10px' }}>
                    {p.freelancer?.email}
                  </span>
                </div>
                <span style={{
                  background: p.status === 'accepted' ? '#2ecc71' : p.status === 'rejected' ? '#e74c3c' : '#f39c12',
                  color: 'white', padding: '4px 12px', borderRadius: '15px', fontSize: '13px'
                }}>
                  {p.status}
                </span>
              </div>
              <p style={{ color: '#555', marginBottom: '10px' }}>{p.description}</p>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>₹{p.bidAmount}</span>
                <span style={{ color: '#999' }}>{p.estimatedDays} days</span>
                {p.status === 'pending' && (
                  <button onClick={() => handleAccept(p._id)} style={{
                    background: '#2ecc71', color: 'white', border: 'none',
                    padding: '6px 14px', borderRadius: '5px', cursor: 'pointer'
                  }}>
                    Accept
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GigDetailPage;