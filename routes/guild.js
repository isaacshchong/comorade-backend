// routes/guild.js
const express = require("express");
const { Client, Databases, Query } = require("appwrite");
const router = express.Router();

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);

const databases = new Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const GUILDS_COLLECTION_ID = process.env.APPWRITE_GUILDS_COLLECTION_ID;

// 🚀 Save guild config
router.post("/", async (req, res) => {
    try {
        const { guildId, prefix, modRole } = req.body;
        const result = await databases.createDocument(
            DATABASE_ID,
            GUILDS_COLLECTION_ID,
            "unique()",
            { guildId, prefix, modRole }
        );
        res.json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 🚀 Get guild config
router.get("/:id", async (req, res) => {
    try {
        const result = await databases.listDocuments(DATABASE_ID, GUILDS_COLLECTION_ID, [
            Query.equal("guildId", req.params.id),
        ]);
        res.json(result.documents);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;