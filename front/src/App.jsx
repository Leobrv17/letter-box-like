import React from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ReviewDetail from './pages/ReviewDetail.jsx';
import MovieDetail from './pages/MovieDetail.jsx';
import Search from './pages/Search.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Me from './pages/Me.jsx';
import { useAuth } from './context/AuthContext.jsx';

const App = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav>
        <Link to="/">Feed</Link>
        <Link to="/search">Search</Link>
        {user ? (
          <>
            <Link to="/me">My space</Link>
            <button type="button" className="secondary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/review/:id" element={<ReviewDetail />} />
          <Route path="/movie/:imdbId" element={<MovieDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/me" element={<Me />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
