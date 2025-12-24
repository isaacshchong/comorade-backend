// services/discord.js
const fetch = require("node-fetch");

async function getUserInfo(token) {
    const res = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
}

async function getGuilds(token) {
    const res = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
}

module.exports = { getUserInfo, getGuilds };