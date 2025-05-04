const knex = require('knex');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create and configure the knex instance
const db = knex({
    client: 'sqlite3',
    connection: {
        filename: process.env.DB_FILE || './db.sqlite3', // Database file path
    },
    useNullAsDefault: true, // prevents issues with null values
});

// Helper function to connect to the database
const connect = async () => {
    try {
        // Check if users table exists
        const tableExists = await db.schema.hasTable('users');
        
        // Create users table if it doesn't exist
        if (!tableExists) {
            await db.schema.createTable('users', (table) => {
                table.increments('id').primary();
                table.string('username').unique().notNullable();
                table.string('password').notNullable();
                table.string('email').unique().notNullable();
                table.string('displayName');
                table.timestamp('created_at').defaultTo(db.fn.now());
            });
            console.log('Users table created successfully!');
        }

        console.log('Database connected successfully!');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        throw error;
    }
};

module.exports = { db, connect };