const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const connectDB = require('./config/database');

const app = express();

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
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

// Only start the server if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore')
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        })
        .catch(err => {
            console.error('Failed to connect to MongoDB:', err);
            process.exit(1);
        });
}

module.exports = app;
