// /pages/Reviews.jsx

import { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    image: null
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('message', formData.message);
    if (formData.image) form.append('image', formData.image);

    const res = await fetch('http://localhost:4000/api/reviews/new', {
      method: 'POST',
      body: form
    });

    if (res.ok) {
      alert('✅ Review submitted for approval!');
      setFormData({ name: '', email: '', message: '', image: null });
    } else {
      alert('❌ Failed to submit review');
    }
    setSubmitting(false);
  };

  return (
    <div className="hold">
      <div className="store">
        <h1>🌟 Customer Reviews</h1>

        <form className="review-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Your Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <input type="email" placeholder="Your Email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          <textarea placeholder="Your Review" required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}></textarea>
          <input type="file" accept="image/*" onChange={e => setFormData({ ...formData, image: e.target.files[0] })} />
          <button type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Submit Review'}</button>
        </form>

        <div className="reviews-list">
            {reviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                reviews.map((r, i) => (
                <div className="review-card" key={i}>
                    <div className="review-header">
                    <h3>{r.name}</h3>
                    <span className="review-date">{new Date(r.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p>{r.message}</p>
                    {r.image && (
                    <img
                        src={`http://localhost:4000${r.image}`}
                        alt="Review"
                        className="review-image"
                    />
                    )}
                </div>
                ))
            )}
            </div>
            <Link to="/" className="back">← Back to Store</Link>
      </div>
      
    </div>
  );
}

export default Reviews;
