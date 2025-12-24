// routes/auth.js
const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const { Client, Databases } = require("appwrite");

// 🔑 Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);

const databases = new Databases(client);

// Replace with your Appwrite Database + Collection IDs
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const USERS_COLLECTION_ID = process.env.APPWRITE_USERS_COLLECTION_ID;

// Discord OAuth values from .env
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// 🚀 Route: Login (redirect to Discord OAuth)
router.get("/login", (req, res) => {
    const url = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
    )}&scope=identify%20guilds`;
    res.redirect(url);
});

// 🚀 Route: Callback (exchange code, save user)
router.get("/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).send("Missing code");

    try {
        // Exchange code for token
        const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "authorization_code",
                code,
                redirect_uri: REDIRECT_URI,
            }),
        });

        const tokenData = await tokenRes.json();
        if (!tokenData.access_token) {
            return res.status(400).json({ error: "Failed to get token", details: tokenData });
        }

        // Fetch user info from Discord
        const userRes = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const user = await userRes.json();

        // Save user info in Appwrite
        const result = await databases.createDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            "unique()", // auto-generate ID
            {
                discordId: user.id,
                username: user.username,
                discriminator: user.discriminator,
                accessToken: tokenData.access_token,
            }
        );

        res.json({ message: "User saved to Appwrite!", user, result });
    } catch (err) {
        console.error(err);
        res.status(500).send("OAuth error");
    }
});

module.exports = router;