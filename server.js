const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

let mediaData = {
    movies: [
        { id: 1, title: 'The Silent Journey', director: 'Christopher Nolan', year: 2010 },
        { id: 2, title: 'Urban Dreams', director: 'Frank Darabont', year: 1994 },
        { id: 3, title: 'Ocean Mysteries', director: 'Frank Darabont', year: 2014 }
    ],
    series: [
        { id: 1, title: 'Frontier Explorers', seasons: 1, creator: 'Vince Gilligan' },
        { id: 2, title: 'Tech Revolution', seasons: 3, creator: 'David Benioff & D.B. Weiss' },
        { id: 3, title: 'Culinary Adventures', seasons: 2, creator: 'David Benioff & D.B. Weiss' }
    ],
    songs: [
        { id: 1, title: 'Sunrise Melodies', artist: 'Queen', year: 1975 },
        { id: 2, title: 'Urban Beats', artist: 'John Lennon', year: 1971 },
        { id: 3, title: 'Nature Symphony', artist: 'John Lennon', year: 1981 }
    ]
};

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Media Store API', endpoints: ['/movies', '/series', '/songs'] });
});

// GET endpoints
app.get('/movies', (req, res) => {
    res.json(mediaData.movies);
});

app.get('/series', (req, res) => {
    res.json(mediaData.series);
});

app.get('/songs', (req, res) => {
    res.json(mediaData.songs);
});

// POST endpoints with validation
app.post('/movies', (req, res) => {
    const { title, director, year } = req.body;
    if (!title || !director || !year) {
        return res.status(400).json({ error: 'Title, director, and year are required' });
    }
    if (typeof title !== 'string' || typeof director !== 'string' || typeof year !== 'number') {
        return res.status(400).json({ error: 'Invalid data format' });
    }
    const newMovie = { id: mediaData.movies.length + 1, title, director, year };
    mediaData.movies.push(newMovie);
    res.status(201).json(mediaData.movies);
});

app.post('/series', (req, res) => {
    const { title, seasons, creator } = req.body;
    if (!title || !seasons || !creator) {
        return res.status(400).json({ error: 'Title, seasons, and creator are required' });
    }
    if (typeof title !== 'string' || typeof creator !== 'string' || typeof seasons !== 'number') {
        return res.status(400).json({ error: 'Invalid data format' });
    }
    const newSeries = { id: mediaData.series.length + 1, title, seasons, creator };
    mediaData.series.push(newSeries);
    res.status(201).json(mediaData.series);
});

app.post('/songs', (req, res) => {
    const { title, artist, year } = req.body;
    if (!title || !artist || !year) {
        return res.status(400).json({ error: 'Title, artist, and year are required' });
    }
    if (typeof title !== 'string' || typeof artist !== 'string' || typeof year !== 'number') {
        return res.status(400).json({ error: 'Invalid data format' });
    }
    const newSong = { id: mediaData.songs.length + 1, title, artist, year };
    mediaData.songs.push(newSong);
    res.status(201).json(mediaData.songs);
});

// PUT endpoints (keeping your original merge behavior)
app.put('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const movieIndex = mediaData.movies.findIndex(m => m.id === id);

    if (movieIndex === -1) {
        return res.status(404).json({ error: 'Movie not found' });
    }

    if (req.body.id && req.body.id !== id) {
        return res.status(400).json({ error: 'ID in body does not match URL parameter' });
    }

    mediaData.movies[movieIndex] = { id, ...mediaData.movies[movieIndex], ...req.body };
    res.json(mediaData.movies);
});

app.put('/series/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const seriesIndex = mediaData.series.findIndex(s => s.id === id);

    if (seriesIndex === -1) {
        return res.status(404).json({ error: 'Series not found' });
    }

    if (req.body.id && req.body.id !== id) {
        return res.status(400).json({ error: 'ID in body does not match URL parameter' });
    }

    mediaData.series[seriesIndex] = { id, ...mediaData.series[seriesIndex], ...req.body };
    res.json(mediaData.series);
});

app.put('/songs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const songIndex = mediaData.songs.findIndex(s => s.id === id);

    if (songIndex === -1) {
        return res.status(404).json({ error: 'Song not found' });
    }

    if (req.body.id && req.body.id !== id) {
        return res.status(400).json({ error: 'ID in body does not match URL parameter' });
    }

    mediaData.songs[songIndex] = { id, ...mediaData.songs[songIndex], ...req.body };
    res.json(mediaData.songs);
});

// DELETE endpoints
app.delete('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const movieIndex = mediaData.movies.findIndex(m => m.id === id);

    if (movieIndex === -1) {
        return res.status(404).json({ error: 'Movie not found' });
    }

    mediaData.movies = mediaData.movies.filter(m => m.id !== id);
    res.json(mediaData.movies);
});

app.delete('/series/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const seriesIndex = mediaData.series.findIndex(s => s.id === id);

    if (seriesIndex === -1) {
        return res.status(404).json({ error: 'Series not found' });
    }

    mediaData.series = mediaData.series.filter(s => s.id !== id);
    res.json(mediaData.series);
});

app.delete('/songs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const songIndex = mediaData.songs.findIndex(s => s.id === id);

    if (songIndex === -1) {
        return res.status(404).json({ error: 'Song not found' });
    }

    mediaData.songs = mediaData.songs.filter(s => s.id !== id);
    res.json(mediaData.songs);
});

// 404 for all other routes
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});