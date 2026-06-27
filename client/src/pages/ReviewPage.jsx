import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';

function ReviewPage() {
  const { userId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: '', reviewee: userId });
  const [submitted, setSubmitted] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API}/reviews/user/${userId}`);
        setReviews(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchReviews();
  }, [userId]);

  const handleSubmit = async () => {
    try {
      await axios.post(`${API}/reviews`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmitted(true);
      const res = await axios.get(`${API}/reviews/user/${userId}`);
      setReviews(res.data);
    } catch (err) {
      alert('Error submitting review');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#1a1a2e', marginBottom: '25px' }}>Reviews</h1>

      {/* Submit Review */}
      {token && !submitted && (
        <div style={{
          background: 'white', borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '25px', marginBottom: '25px'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#1a1a2e' }}>Write a Review</h2>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Rating</label>
            <select
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              style={{
                width: '100%', padding: '10px', border: '1px solid #ddd',
                borderRadius: '5px', boxSizing: 'border-box'
              }}
            >
              <option value={5}>⭐⭐⭐⭐⭐ 5 - Excellent</option>
              <option value={4}>⭐⭐⭐⭐ 4 - Good</option>
              <option value={3}>⭐⭐⭐ 3 - Average</option>
              <option value={2}>⭐⭐ 2 - Poor</option>
              <option value={1}>⭐ 1 - Terrible</option>
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Comment</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows={4}
              style={{
                width: '100%', padding: '10px', border: '1px solid #ddd',
                borderRadius: '5px', boxSizing: 'border-box', resize: 'vertical'
              }}
            />
          </div>
          <button onClick={handleSubmit} style={{
            background: '#3498db', color: 'white', border: 'none',
            padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px'
          }}>
            Submit Review
          </button>
        </div>
      )}

      {submitted && (
        <div style={{
          background: '#d4edda', color: '#155724', padding: '15px',
          borderRadius: '8px', marginBottom: '25px', textAlign: 'center'
        }}>
          Review submitted successfully!
        </div>
      )}

      {/* Reviews List */}
      <div style={{
        background: 'white', borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '25px'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#1a1a2e' }}>
          All Reviews ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center' }}>No reviews yet</p>
        ) : (
          reviews.map(r => (
            <div key={r._id} style={{
              border: '1px solid #eee', borderRadius: '8px',
              padding: '20px', marginBottom: '15px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <strong style={{ color: '#1a1a2e' }}>{r.reviewer?.name}</strong>
                <span style={{ color: '#f39c12' }}>
                  {'⭐'.repeat(r.rating)}
                </span>
              </div>
              <p style={{ color: '#555' }}>{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewPage;