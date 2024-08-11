// Require
const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();
require('colors');

// .env checking
if (!process.env.SESSION_KEY) { console.log("A .env file is needed with SESSION_KEY = 'Your key'!".red); process.exit(1); }
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'development') { console.log("A .env file is needed with NODE_ENV = 'development' OR 'production'".red); process.exit(1); }

// Express setup
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware setup
const logger = require('./src/middlewares/logger');
const errorHandler = require('./src/middlewares/errorHandler');
const mainRoutes = require('./src/routes/mainRoutes');

// Setup session middleware
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // For HTTP, set to true for HTTPS
}));

// Logger
app.use(logger);

// Define routes
app.use(mainRoutes);

// Error handling middleware
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
});

module.exports = app;