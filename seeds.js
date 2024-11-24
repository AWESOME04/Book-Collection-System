const { pool, initializeDatabase } = require('./config/database');

const genres = [
    { name: 'Fiction', description: 'Literary works created from imagination' },
    { name: 'Non-Fiction', description: 'Factual and informative works' },
    { name: 'Science Fiction', description: 'Fiction based on scientific discoveries or systems' },
    { name: 'Mystery', description: 'Works involving solving a crime or puzzle' },
    { name: 'Romance', description: 'Stories about love and relationships' },
    { name: 'Thriller', description: 'Suspenseful and exciting works' },
    { name: 'Fantasy', description: 'Works featuring magical and supernatural elements' },
    { name: 'Biography', description: 'Account of someone\'s life' },
    { name: 'History', description: 'Works about past events' },
    { name: 'Poetry', description: 'Literary works emphasizing expression and form' }
];

const books = [
    {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        price: 15.99,
        genre: 'Fiction',
        copies_left: 10
    },
    {
        title: 'Dune',
        author: 'Frank Herbert',
        price: 19.99,
        genre: 'Science Fiction',
        copies_left: 15
    },
    {
        title: 'The Silent Patient',
        author: 'Alex Michaelides',
        price: 24.99,
        genre: 'Mystery',
        copies_left: 8
    },
    {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        price: 12.99,
        genre: 'Romance',
        copies_left: 20
    },
    {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        price: 21.99,
        genre: 'Fantasy',
        copies_left: 12
    },
    {
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        price: 29.99,
        genre: 'Biography',
        copies_left: 5
    },
    {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        price: 18.99,
        genre: 'Non-Fiction',
        copies_left: 7
    }
];

async function seedDatabase() {
    try {
        // Initialize database (create tables)
        await initializeDatabase();

        // Clear existing data
        await pool.query('DELETE FROM books');
        await pool.query('DELETE FROM genres');
        console.log('Existing data cleared');

        // Insert genres
        for (const genre of genres) {
            await pool.query(
                'INSERT INTO genres (name, description) VALUES ($1, $2)',
                [genre.name, genre.description]
            );
        }
        console.log('Genres inserted');

        // Get genre IDs
        const { rows: genreRows } = await pool.query('SELECT id, name FROM genres');
        const genreMap = {};
        genreRows.forEach(genre => {
            genreMap[genre.name] = genre.id;
        });

        // Insert books
        for (const book of books) {
            const genreId = genreMap[book.genre];
            await pool.query(
                'INSERT INTO books (title, author, price, genre_id, copies_left) VALUES ($1, $2, $3, $4, $5)',
                [book.title, book.author, book.price, genreId, book.copies_left]
            );
        }
        console.log('Books inserted');

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the pool
        await pool.end();
    }
}

// Run the seeding
seedDatabase();