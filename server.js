
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// --- In-Memory Database ---
// This data is reset every time the server restarts.

const generateMovies = (count, seed) => {
  return Array.from({ length: count }, (_, i) => ({
    id: seed * 100 + i,
    title: `Awesome Movie Title ${seed * 100 + i}`,
    posterUrl: `https://picsum.photos/400/600?random=${seed * 100 + i}`,
    description: `This is a compelling description for Awesome Movie Title ${seed * 100 + i}. It involves action, drama, and a touch of romance that will keep you hooked until the very end.`
  }));
};

let db = {
  categories: [
    { title: 'Most Popular', movies: generateMovies(10, 1) },
    { title: 'New Releases', movies: generateMovies(10, 2) },
    { title: 'Action & Adventure', movies: generateMovies(10, 3) },
    { title: 'Sci-Fi Universe', movies: generateMovies(10, 4) },
    { title: 'Comedy Central', movies: generateMovies(10, 5) },
    { title: 'Horror Flicks', movies: generateMovies(10, 6) },
  ]
};

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());

// --- API Endpoints ---

// GET /api/content
// Returns the current list of all categories and their movies.
app.get('/api/content', (req, res) => {
  console.log('GET /api/content - Sending content data.');
  res.json(db.categories);
});

// POST /api/content
// Receives a new array of categories and replaces the existing data.
app.post('/api/content', (req, res) => {
  const updatedCategories = req.body;
  if (!Array.isArray(updatedCategories)) {
    console.error('POST /api/content - Invalid data format received.');
    return res.status(400).json({ error: 'Invalid data format. Expected an array of categories.' });
  }
  db.categories = updatedCategories;
  console.log('POST /api/content - Content updated successfully.');
  res.status(200).json({ message: 'Content updated successfully.' });
});

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`
    ==================================================
    Backend server is running on http://localhost:${PORT}
    ==================================================
  `);
});
