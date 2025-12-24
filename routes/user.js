// routes/user.js
const express = require("express");
const { Client, Databases, Query } = require("appwrite");
const router = express.Router();

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);

const databases = new Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const USERS_COLLECTION_ID = process.env.APPWRITE_USERS_COLLECTION_ID;

// 🚀 Get user by Discord ID
router.get("/:id", async (req, res) => {
    try {
        const result = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
            Query.equal("discordId", req.params.id),
        ]);
        res.json(result.documents);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
