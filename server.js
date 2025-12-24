// server.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(bodyParser.json());

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const guildRoutes = require("./routes/guild");

// Mount routes
app.use("/auth", authRoutes);       // /auth/login, /auth/callback
app.use("/api/user", userRoutes);   // /api/user/:id
app.use("/api/guild", guildRoutes); // /api/guild/:id, /api/guild/

// Root route
app.get("/", (req, res) => {
    res.send("✅ Comorade Backend is running");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));