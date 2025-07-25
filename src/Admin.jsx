// /pages/Admin.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function AdminPanel() {
  const [reviews, setReviews] = useState([]);
  const [authorized, setAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const login = async (tokenToTest = passwordInput.trim()) => {
    const res = await fetch('https://practicestoreback.onrender.com/api/reviews/all', {
      headers: {
        Authorization: `Bearer ${tokenToTest}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      setReviews(data);
      setAuthorized(true);
    } else {
      if (tokenToTest !== passwordInput.trim()) {
        localStorage.removeItem('adminToken');
      }
      alert('Incorrect password.');
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('adminToken');
    if (stored) {
      login(stored);
    }
  }, []);

  const approveReview = async (id) => {
    const token = localStorage.getItem('adminToken');
    await fetch(`https://practicestoreback.onrender.com/api/reviews/approve/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: true } : r));
  };

  const deleteReview = async (id, image) => {
    const token = localStorage.getItem('adminToken');
    await fetch(`https://practicestoreback.onrender.com/api/reviews/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ image })
    });
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  if (!authorized) {
    return (
      <div className="hold">
        <div className="store">
          <h1>🔐 Admin Login</h1>
          <input
            type="password"
            placeholder="Enter admin password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button onClick={() => login()}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="hold">
      <div className="store">
        <h1>🔧 Admin Review Panel</h1>
        <div className="reviews-list">
          {reviews.length === 0 ? <p>No reviews available.</p> : reviews.map((r, i) => (
            <div key={i} className="review-card">
              <h3>{r.name} ({r.email})</h3>
              <p>{r.message}</p>
              <p><strong>Status:</strong> {r.approved ? '✅ Approved' : '❌ Not Approved'}</p>
              {r.image && <img src={`https://practicestoreback.onrender.com${r.image}`} alt="Attachment" className="review-image" />}
              <div style={{ marginTop: '10px' }}>
                {!r.approved && (
                  <button style={{ marginRight: '10px' }} onClick={() => approveReview(r.id)}>✅ Approve</button>
                )}
                <button
                  style={{ background: 'crimson', color: 'white' }}
                  onClick={() => deleteReview(r.id, r.image)}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <Link to="/" className="back">← Back to Store</Link>
      </div>
    </div>
  );
}

export default AdminPanel;
