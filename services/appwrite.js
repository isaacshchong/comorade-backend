// services/appwrite.js
const { Client, Databases } = require("appwrite");

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);

const databases = new Databases(client);

module.exports = { client, databases };