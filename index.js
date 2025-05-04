// External dependencies
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Middleware
const errorHandler = require('./middlewares/errorHandler').errorHandler;

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const guildRoutes = require('./routes/guildRoutes');

// Database
const db = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(cors()); // Enable CORS (if needed)
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/guilds', guildRoutes);

// Static file serving
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Error handling middleware (after all routes)
app.use(errorHandler);

// React app fallback route - handle all non-API routes
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Database connection (SQLite or any DB)
db.connect()
    .then(() => {
        console.log('Connected to the database.');
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});