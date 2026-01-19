import fetch from 'node-fetch';

const defaultBaseUrl = 'https://www.omdbapi.com/';

const createLiveProvider = () => {
  const apiKey = process.env.OMDB_API_KEY;
  const baseUrl = process.env.OMDB_BASE_URL || defaultBaseUrl;

  if (!apiKey) {
    throw new Error('Missing OMDB_API_KEY in environment');
  }

  const buildUrl = (params) => {
    const url = new URL(baseUrl);
    Object.entries({ ...params, apikey: apiKey }).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  };

  return {
    async searchMovies(query, page = 1) {
      const response = await fetch(buildUrl({ s: query, page: String(page) }));
      const data = await response.json();
      if (data.Response === 'False') {
        return { results: [], totalResults: 0, error: data.Error };
      }
      return { results: data.Search || [], totalResults: Number(data.totalResults || 0) };
    },
    async getMovie(imdbId) {
      const response = await fetch(buildUrl({ i: imdbId, plot: 'full' }));
      const data = await response.json();
      if (data.Response === 'False') {
        return null;
      }
      return data;
    }
  };
};

const createMockProvider = () => ({
  async searchMovies(query, page = 1) {
    return {
      results: [
        {
          Title: `Mock Movie for ${query}`,
          Year: '2024',
          imdbID: 'tt0000001',
          Type: 'movie',
          Poster: 'N/A'
        }
      ],
      totalResults: 1,
      page
    };
  },
  async getMovie(imdbId) {
    return {
      Title: 'Mock Movie',
      Year: '2024',
      imdbID: imdbId,
      Type: 'movie',
      Poster: 'N/A',
      Plot: 'Mock plot for development.'
    };
  }
});

export const createOmdbProvider = () => {
  if (process.env.OMDB_USE_MOCK === 'true') {
    return createMockProvider();
  }
  return createLiveProvider();
};
