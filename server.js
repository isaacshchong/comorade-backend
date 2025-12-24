// server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const guildRoutes = require('./routes/guild');
const errorHandler = require('./utils/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup (use SESSION_SECRET from env)
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'fallback_secret',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // set true if behind HTTPS
    })
);

// Routes
app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/guild', guildRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({ status: 'Backend is running 🚀' });
});

// Error handler
app.use(errorHandler);

// Port handling for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});