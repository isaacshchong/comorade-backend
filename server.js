// server.js (backend only, no static HTML serving)
import express from 'express';
import session from 'express-session';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 4000;

// --- Session setup ---
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false
}));

// --- Middleware to enforce login ---
function requireLogin(req, res, next) {
    if (!req.session.accessToken) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    next();
}

// --- OAuth2 login (user authentication) ---
app.get('/login', (req, res) => {
    const redirect = encodeURIComponent(process.env.REDIRECT_URI);
    const clientId = process.env.CLIENT_ID;
    const permissions = 8;
    const scope = encodeURIComponent('identify connections guilds.join guilds.channels.read bot');
    const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&response_type=code&redirect_uri=${redirect}&integration_type=0&scope=${scope}`;
    res.redirect(url);
});

// --- Bot invite (separate link) ---
app.get('/invite', (req, res) => {
    const clientId = process.env.CLIENT_ID;
    const permissions = 8;
    const scope = encodeURIComponent('bot applications.commands');
    const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=${scope}`;
    res.redirect(url);
});

// --- OAuth2 callback ---
app.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).json({ error: 'Missing code' });
    }

    try {
        const params = new URLSearchParams();
        params.append('client_id', process.env.CLIENT_ID);
        params.append('client_secret', process.env.CLIENT_SECRET);
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', process.env.REDIRECT_URI);
        params.append('scope', 'identify connections guilds.join guilds.channels.read bot');

        const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        const tokenData = await tokenRes.json();

        if (!tokenData.access_token) {
            console.error('OAuth failed:', tokenData);
            return res.status(401).json({ error: 'OAuth failed' });
        }

        req.session.accessToken = tokenData.access_token;
        res.json({ success: true });
    } catch (err) {
        console.error('OAuth error:', err);
        return res.status(500).json({ error: 'OAuth error' });
    }
});

// --- API route to get user info ---
app.get('/api/me', requireLogin, async (req, res) => {
    try {
        const userRes = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${req.session.accessToken}` }
        });
        const userData = await userRes.json();
        res.json(userData);
    } catch (err) {
        console.error('Failed to fetch user info:', err);
        res.status(500).json({ error: 'Failed to fetch user info' });
    }
});

// --- Logout ---
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});

// --- Start server ---
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});