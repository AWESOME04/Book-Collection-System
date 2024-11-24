const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET all books
router.get('/', async (req, res) => {
    try {
        let query = `
            SELECT b.*, g.name as genre_name 
            FROM books b 
            LEFT JOIN genres g ON b.genre_id = g.id
        `;
        const params = [];

        if (req.query.genre) {
            query += ' WHERE g.id = $1';
            params.push(req.query.genre);
        }

        const { rows: books } = await pool.query(query, params);
        const { rows: genres } = await pool.query('SELECT * FROM genres ORDER BY name');

        console.log('Found books:', books.length);
        console.log('Found genres:', genres.length);
        
        res.render('books', { books, genres });
    } catch (err) {
        console.error('Error in /books route:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET new book form
router.get('/new', async (req, res) => {
    try {
        const { rows: genres } = await pool.query('SELECT * FROM genres ORDER BY name');
        console.log('Loading add book form with genres:', genres.map(g => g.name));
        res.render('add_book', { genres });
    } catch (err) {
        console.error('Error loading add book form:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST new book
router.post('/', async (req, res) => {
    try {
        const { title, author, price, genre_id, copies_left } = req.body;
        console.log('Received book data:', req.body);

        const { rows } = await pool.query(
            'INSERT INTO books (title, author, price, genre_id, copies_left) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, author, price, genre_id, copies_left || 1]
        );

        res.redirect('/books');
    } catch (err) {
        console.error('Error creating book:', err);
        const { rows: genres } = await pool.query('SELECT * FROM genres ORDER BY name');
        res.render('add_book', { 
            genres,
            error: err.message,
            book: req.body
        });
    }
});

// GET book details
router.get('/:id', async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT b.*, g.name as genre_name 
             FROM books b 
             LEFT JOIN genres g ON b.genre_id = g.id 
             WHERE b.id = $1`,
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const book = rows[0];
        console.log('Found book:', book.title);
        res.render('book_details', { book });
    } catch (err) {
        console.error('Error in /books/:id route:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET edit book form
router.get('/:id/edit', async (req, res) => {
    try {
        const { rows: [book] } = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
        const { rows: genres } = await pool.query('SELECT * FROM genres ORDER BY name');

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        console.log('Loading edit book form with genres:', genres.map(g => g.name));
        res.render('edit_book', { book, genres });
    } catch (err) {
        console.error('Error loading edit book form:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT update book
router.put('/:id', async (req, res) => {
    try {
        const { title, author, price, genre_id, copies_left } = req.body;
        console.log('Received updated book data:', req.body);

        const { rows } = await pool.query(
            `UPDATE books 
             SET title = $1, author = $2, price = $3, genre_id = $4, copies_left = $5
             WHERE id = $6 
             RETURNING *`,
            [title, author, price, genre_id, copies_left, req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.redirect('/books');
    } catch (err) {
        console.error('Error updating book:', err);
        const { rows: genres } = await pool.query('SELECT * FROM genres ORDER BY name');
        res.render('edit_book', { 
            genres,
            error: err.message,
            book: { ...req.body, id: req.params.id }
        });
    }
});

// DELETE book
router.delete('/:id', async (req, res) => {
    try {
        const { rows } = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        console.log('Deleted book:', rows[0].title);
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting book:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
