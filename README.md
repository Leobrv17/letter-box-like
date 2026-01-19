# Letterboxd-like (fullstack)

Projet fullstack minimal “Letterboxd-like” basé sur l’API OMDb (via IMDb), avec un backend Express + MongoDB et un front React (Vite).

## Structure

```
/README.md
/front
/back
```

## Prérequis

- Node.js 18+
- MongoDB en local ou URI Atlas
- Clé OMDb (https://www.omdbapi.com/)

## Installation

### Backend

```bash
cd back
npm install
cp .env.example .env
```

Renseigne `MONGO_URI`, `JWT_SECRET`, `OMDB_API_KEY`.

### Frontend

```bash
cd front
npm install
cp .env.example .env
```

## Lancement en local

### Base de données MongoDB (Docker)

```bash
docker compose up -d
```

MongoDB est exposé sur `mongodb://localhost:27017/letterbox`.

### Backend (port 4000)

```bash
cd back
npm run dev
```

### Frontend (port 3000)

```bash
cd front
npm run dev
```

Le front utilise un proxy Vite vers `http://localhost:4000` pour `/api`.

## Variables d’environnement

### Backend (`back/.env`)

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/letterbox
JWT_SECRET=supersecret
JWT_EXPIRES_IN=1h
OMDB_API_KEY=your_key
OMDB_BASE_URL=https://www.omdbapi.com/
OMDB_USE_MOCK=false
```

### Front (`front/.env`)

```
VITE_API_BASE=/api
VITE_USE_MOCK=false
```

## Scripts npm utiles

### Backend

- `npm run dev` : démarre Express avec nodemon
- `npm start` : démarre Express

### Frontend

- `npm run dev` : Vite sur :3000
- `npm run build` : build production
- `npm run preview` : preview production

## Endpoints principaux

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Movies (proxy OMDb)

- `GET /api/movies/search?q=batman&page=1`
- `GET /api/movies/:imdbId`

### Reviews

- `GET /api/reviews?limit=20&page=1`
- `GET /api/reviews/:id`
- `GET /api/reviews/mine`
- `POST /api/reviews`
- `PUT /api/reviews/:id`
- `DELETE /api/reviews/:id`

### Users

- `GET /api/users/:username/public`

### Favorites

- `GET /api/favorites`
- `POST /api/favorites/:imdbId`
- `DELETE /api/favorites/:imdbId`

## Comptes de test / seed

Aucun seed fourni par défaut. Crée un compte via `/register`.

## Notes techniques

- Le front n’appelle jamais OMDb directement : uniquement le backend.
- Le backend expose un provider OMDb remplaçable (`OMDB_USE_MOCK=true`).
- Le front peut utiliser un mock local via `VITE_USE_MOCK=true`.
- JWT avec expiration (`JWT_EXPIRES_IN`) et gestion 401 côté front (logout).
