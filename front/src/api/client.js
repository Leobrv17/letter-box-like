import axios from 'axios';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';
const baseURL = import.meta.env.VITE_API_BASE || '/api';

const mockStore = {
  movies: [
    { Title: 'Mock Movie', Year: '2024', imdbID: 'tt0000001', Poster: 'N/A' }
  ]
};

const mockClient = {
  async get(path) {
    if (path.startsWith('/movies/search')) {
      return { data: { results: mockStore.movies, totalResults: 1 } };
    }
    if (path.startsWith('/movies/')) {
      return { data: { Title: 'Mock Movie', imdbID: 'tt0000001', Plot: 'Mock plot' } };
    }
    if (path.startsWith('/reviews')) {
      return { data: { reviews: [], total: 0, page: 1, limit: 20 } };
    }
    return { data: {} };
  },
  async post() {
    return { data: {} };
  },
  async put() {
    return { data: {} };
  },
  async delete() {
    return { data: {} };
  }
};

const client = axios.create({
  baseURL
});

let interceptorId = null;

export const apiClient = {
  client: useMock ? mockClient : client,
  addAuthInterceptor(getToken, onUnauthorized) {
    if (useMock) {
      return null;
    }
    interceptorId = client.interceptors.request.use((config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          onUnauthorized();
        }
        return Promise.reject(error);
      }
    );
    return interceptorId;
  },
  removeAuthInterceptor(id) {
    if (useMock || id === null) {
      return;
    }
    client.interceptors.request.eject(id);
  }
};
