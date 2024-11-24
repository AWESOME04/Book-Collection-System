const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const { initializeDatabase } = require('./config/database');

const app = express();

// Initialize database without blocking server start
initializeDatabase().catch(err => {
    console.error('Failed to initialize database:', err);
    // Don't exit process in serverless environment
    // process.exit(1);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const bookRoutes = require('./routes/books');
app.use('/books', bookRoutes);

// Home route
app.get('/', (req, res) => {
    res.redirect('/books');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('error', {
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 3000;

// In development, we can listen to a port
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log('Press Ctrl+C to quit.');
    });
}

// For serverless environment
module.exports = app;
