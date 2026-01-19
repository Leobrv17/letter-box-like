import { apiClient } from './client.js';

export const api = {
  async register(payload) {
    const { data } = await apiClient.client.post('/auth/register', payload);
    return data;
  },
  async login(payload) {
    const { data } = await apiClient.client.post('/auth/login', payload);
    return data;
  },
  async logout() {
    const { data } = await apiClient.client.post('/auth/logout');
    return data;
  },
  async me() {
    const { data } = await apiClient.client.get('/auth/me');
    return data;
  },
  async fetchReviews(params) {
    const { data } = await apiClient.client.get('/reviews', { params });
    return data;
  },
  async fetchReview(id) {
    const { data } = await apiClient.client.get(`/reviews/${id}`);
    return data;
  },
  async fetchMyReviews() {
    const { data } = await apiClient.client.get('/reviews/mine');
    return data;
  },
  async createReview(payload) {
    const { data } = await apiClient.client.post('/reviews', payload);
    return data;
  },
  async updateReview(id, payload) {
    const { data } = await apiClient.client.put(`/reviews/${id}`, payload);
    return data;
  },
  async deleteReview(id) {
    const { data } = await apiClient.client.delete(`/reviews/${id}`);
    return data;
  },
  async searchMovies(query, page = 1, options = {}) {
    const { year, type } = options;
    const { data } = await apiClient.client.get('/movies/search', {
      params: { q: query, page, year: year || undefined, type: type || undefined }
    });
    return data;
  },
  async fetchMovie(imdbId) {
    const { data } = await apiClient.client.get(`/movies/${imdbId}`);
    return data;
  },
  async fetchPublicProfile(username) {
    const { data } = await apiClient.client.get(`/users/${username}/public`);
    return data;
  },
  async fetchFavorites() {
    const { data } = await apiClient.client.get('/favorites');
    return data;
  },
  async addFavorite(imdbId) {
    const { data } = await apiClient.client.post(`/favorites/${imdbId}`);
    return data;
  },
  async removeFavorite(imdbId) {
    const { data } = await apiClient.client.delete(`/favorites/${imdbId}`);
    return data;
  },
  async fetchWatchlist() {
    const { data } = await apiClient.client.get('/watchlist');
    return data;
  },
  async addToWatchlist(imdbId) {
    const { data } = await apiClient.client.post(`/watchlist/${imdbId}`);
    return data;
  },
  async removeFromWatchlist(imdbId) {
    const { data } = await apiClient.client.delete(`/watchlist/${imdbId}`);
    return data;
  }
};
