import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const API = 'http://localhost:5000/api';

function PaymentPage() {
  const { user } = useSelector((state) => state.auth);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const token = localStorage.getItem('token');

  const handlePayment = async () => {
    if (!amount) return alert('Please enter amount');
    setLoading(true);
    try {
      const { data: order } = await axios.post(`${API}/payments/order`,
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: 'rzp_test_placeholder',
        amount: order.amount,
        currency: 'INR',
        name: 'SkillSphere',
        description: 'Milestone Payment',
        order_id: order.id,
        handler: async (response) => {
          try {
            await axios.post(`${API}/payments/verify`, {
              ...response,
              amount: Number(amount)
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(true);
          } catch (err) {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: '#3498db' }
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      alert('Payment failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#1a1a2e', marginBottom: '25px' }}>Make Payment</h1>

      {success ? (
        <div style={{
          background: '#d4edda', color: '#155724', padding: '30px',
          borderRadius: '10px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '50px', marginBottom: '15px' }}>✅</div>
          <h2>Payment Successful!</h2>
          <p>Your payment has been processed successfully.</p>
        </div>
      ) : (
        <div style={{
          background: 'white', borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '30px'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>
              Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%', padding: '12px', border: '1px solid #ddd',
                borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{
            background: '#f8f9fa', borderRadius: '8px',
            padding: '15px', marginBottom: '20px'
          }}>
            <h4 style={{ color: '#1a1a2e', marginBottom: '10px' }}>Payment Summary</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#666' }}>Amount</span>
              <span style={{ color: '#1a1a2e' }}>₹{amount || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#666' }}>Platform Fee (5%)</span>
              <span style={{ color: '#1a1a2e' }}>₹{((Number(amount) || 0) * 0.05).toFixed(2)}</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              borderTop: '1px solid #ddd', paddingTop: '8px', marginTop: '8px'
            }}>
              <span style={{ color: '#1a1a2e', fontWeight: 'bold' }}>Total</span>
              <span style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '18px' }}>
                ₹{((Number(amount) || 0) * 1.05).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            style={{
              width: '100%', padding: '14px', background: '#3498db',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '16px', cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            {loading ? 'Processing...' : '💳 Pay Now'}
          </button>

          <p style={{ color: '#999', fontSize: '12px', textAlign: 'center', marginTop: '15px' }}>
            Secured by Razorpay
          </p>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;