require('dotenv').config();
const { Pool } = require('pg');

let pool;

const getPool = () => {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            },
            max: 1,
            connectionTimeoutMillis: 5000
        });
    }
    return pool;
};

const initializeDatabase = async () => {
    const client = await getPool().connect();
    try {
        // Test the connection
        await client.query('SELECT NOW()');
        console.log('Database connected successfully');

        // Create genres table if it doesn't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS genres (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create books table if it doesn't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS books (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                genre_id INTEGER REFERENCES genres(id),
                copies_left INTEGER DEFAULT 1,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Database tables initialized successfully');
    } catch (err) {
        console.error('Database initialization error:', err);
        throw err;
    } finally {
        client.release();
    }
};

module.exports = { 
    pool: getPool(), 
    initializeDatabase,
    query: (text, params) => getPool().query(text, params)
};
