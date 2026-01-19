import React, { useEffect, useState } from 'react';
import { api } from '../api/index.js';
import { useAuth } from '../context/AuthContext.jsx';

const emptyForm = {
  imdbId: '',
  titleSnapshot: '',
  rating: '',
  text: '',
  visibility: 'public'
};

const Me = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('loading');

  const loadData = async () => {
    const [reviewData, favoriteData] = await Promise.all([
      api.fetchMyReviews(),
      api.fetchFavorites()
    ]);
    setReviews(reviewData.reviews || []);
    setFavorites(favoriteData.favorites || []);
  };

  useEffect(() => {
    let active = true;
    loadData()
      .then(() => {
        if (active) setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      rating: form.rating === '' ? undefined : Number(form.rating)
    };
    if (editingId) {
      await api.updateReview(editingId, payload);
    } else {
      await api.createReview(payload);
    }
    setForm(emptyForm);
    setEditingId(null);
    await loadData();
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setForm({
      imdbId: review.imdbId,
      titleSnapshot: review.titleSnapshot,
      rating: review.rating ?? '',
      text: review.text,
      visibility: review.visibility
    });
  };

  const handleDelete = async (id) => {
    await api.deleteReview(id);
    await loadData();
  };

  if (!user) return <p>Please login to access your space.</p>;
  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'error') return <p>Unable to load your data.</p>;

  return (
    <section>
      <h1>Welcome {user.username}</h1>
      <div className="grid two">
        <div>
          <h2>{editingId ? 'Edit review' : 'Create review'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              IMDb ID
              <input
                value={form.imdbId}
                onChange={(event) => setForm({ ...form, imdbId: event.target.value })}
              />
            </label>
            <label>
              Title snapshot
              <input
                value={form.titleSnapshot}
                onChange={(event) => setForm({ ...form, titleSnapshot: event.target.value })}
              />
            </label>
            <label>
              Rating (0-10)
              <input
                type="number"
                min="0"
                max="10"
                value={form.rating}
                onChange={(event) => setForm({ ...form, rating: event.target.value })}
              />
            </label>
            <label>
              Review text
              <textarea
                rows="4"
                value={form.text}
                onChange={(event) => setForm({ ...form, text: event.target.value })}
              />
            </label>
            <label>
              Visibility
              <select
                value={form.visibility}
                onChange={(event) => setForm({ ...form, visibility: event.target.value })}
              >
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="private">Private</option>
              </select>
            </label>
            <button type="submit">{editingId ? 'Update' : 'Create'} review</button>
          </form>
        </div>
        <div>
          <h2>Your reviews</h2>
          {reviews.length === 0 && <p>No reviews yet.</p>}
          {reviews.map((review) => (
            <div key={review._id} className="card">
              <h3>{review.titleSnapshot}</h3>
              <p>{review.text}</p>
              <div>
                <button type="button" onClick={() => handleEdit(review)}>
                  Edit
                </button>
                <button type="button" className="secondary" onClick={() => handleDelete(review._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          <h2>Your favorites</h2>
          {favorites.length === 0 && <p>No favorites yet.</p>}
          {favorites.map((favorite) => (
            <div key={favorite._id} className="card">
              <p>IMDb ID: {favorite.imdbId}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Me;
