import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/index.js';
import ReviewCard from '../components/ReviewCard.jsx';

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    api
      .fetchPublicProfile(username)
      .then((data) => {
        if (active) {
          setProfile(data.user);
          setReviews(data.reviews || []);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (active) {
          setStatus('error');
        }
      });
    return () => {
      active = false;
    };
  }, [username]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'error') return <p>User not found.</p>;

  return (
    <section>
      <h1>{profile.username}</h1>
      <p>Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
      <h2>Public reviews</h2>
      {reviews.length === 0 && <p>No public reviews yet.</p>}
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </section>
  );
};

export default Profile;
