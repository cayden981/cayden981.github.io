const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIG ---
const MAX_SPEED = 12; // Max units a player can move per update
const VALID_ROOMS = ["FOREST", "STUMP", "CAVES", "CITY"];
const activePlayers = new Map();

// --- ANTI-CHEAT MIDDLEWARE ---
app.use((req, res, next) => {
    const ua = (req.headers['user-agent'] || "").toLowerCase();
    const forbidden = ['java', 'python', 'node-fetch', 'axios', 'postman', 'curl'];

    if (forbidden.some(term => ua.includes(term))) {
        return res.status(403).json({ error: "Unauthorized Client" });
    }
    next();
});

// --- AUTH: JOIN ROOM ---
app.post('/auth/join', (req, res) => {
    const { username, roomCode } = req.body;

    if (!VALID_ROOMS.includes(roomCode?.toUpperCase())) {
        return res.status(400).json({ error: "Invalid Room" });
    }

    const sessionToken = crypto.randomBytes(24).toString('hex');
    
    activePlayers.set(username, {
        room: roomCode.toUpperCase(),
        token: sessionToken,
        lastPos: { x: 0, y: 0, z: 0 },
        lastUpdate: Date.now(),
        violations: 0
    });

    res.json({ success: true, token: sessionToken });
});

// --- THE FIX: MOVEMENT & ANTI-FLY VALIDATOR ---
app.post('/api/update-pos', (req, res) => {
    const { username, token, x, y, z } = req.body;
    const player = activePlayers.get(username);

    // 1. Session Check (Prevents JS injection from other users)
    if (!player || player.token !== token) {
        return res.status(401).json({ error: "Auth Failed" });
    }

    const now = Date.now();
    const deltaTime = (now - player.lastUpdate) / 1000;

    // 2. Velocity Check (Calculates distance to detect Teleport/Fly)
    const dx = x - player.lastPos.x;
    const dy = y - player.lastPos.y;
    const dz = z - player.lastPos.z;
    const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);

    // If moving faster than MAX_SPEED, flag as cheat
    if (distance > MAX_SPEED && deltaTime > 0) {
        player.violations++;
        console.warn(`[CHEAT ALERT] ${username} moved ${distance.toFixed(2)} units too fast!`);
        
        if (player.violations > 3) {
            activePlayers.delete(username);
            return res.status(403).json({ error: "Kicked for Fly/Speed Hacks" });
        }
    }

    // Update player state
    player.lastPos = { x, y, z };
    player.lastUpdate = now;

    res.json({ success: true });
});

// --- CLEANUP ---
setInterval(() => {
    const now = Date.now();
    for (let [user, data] of activePlayers.entries()) {
        if (now - data.lastUpdate > 30000) activePlayers.delete(user);
    }
}, 30000);

app.listen(3000, () => console.log("Secure Backend Live on Port 3000"));
