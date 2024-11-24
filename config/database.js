const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:z4VWeX0SdvmI@ep-lucky-river-a5d1j6wg.us-east-2.aws.neon.tech/neondb?sslmode=require',
    ssl: {
        rejectUnauthorized: false
    }
});

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Connected to PostgreSQL database');
        release();
    }
});

// Create tables if they don't exist
const initializeDatabase = async () => {
    try {
        // Create genres table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS genres (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create books table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS books (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                genre_id INTEGER REFERENCES genres(id),
                copies_left INTEGER NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Database tables created successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
};

module.exports = {
    pool,
    initializeDatabase
};
