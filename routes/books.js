const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Genre = require('../models/genre');

// GET all books
router.get('/', async (req, res) => {
    try {
        const query = {};
        if (req.query.genre) {
            query.genre_id = req.query.genre;
        }
        
        const books = await Book.find(query).populate('genre_id');
        const genres = await Genre.find();
        res.render('books', { books, genres });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET new book form
router.get('/new', async (req, res) => {
    try {
        const genres = await Genre.find();
        res.render('add_book', { genres });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new book
router.post('/', async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).redirect('/books');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET book details
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('genre_id');
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.render('book_details', { book });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET edit book form
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        const genres = await Genre.find();
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.render('update_book', { book, genres });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update book
router.put('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.redirect('/books');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE book
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
