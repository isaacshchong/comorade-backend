import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import authRoutes from './routes/auth.js';

const app = express();

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ status: 'Supabase backend is running 🚀' });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});