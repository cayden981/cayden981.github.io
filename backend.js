const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

// Middleware
app.use(cors()); // Allows your GitHub Pages site to talk to this server
app.use(express.json());

// --- SECURITY: ANTI-JAVA / ANTI-CHEAT TOOL BLOCKER ---
app.use((req, res, next) => {
    const ua = req.headers['user-agent'] || "";
    
    // Block common Java-based injection tools and headless scrapers
    const forbidden = ["Java", "python-requests", "node-fetch", "axios", "Postman", "Runtime"];
    
    const isMalicious = forbidden.some(term => ua.includes(term));

    if (isMalicious) {
        console.log(`[BLOCK] Blocked unauthorized tool: ${ua}`);
        return res.status(403).json({ error: "Access Denied: External Scripts Blocked" });
    }
    next();
});

// --- DATABASE (In-Memory) ---
const activePlayers = new Map();
const VALID_ROOMS = ["FOREST", "STUMP", "CAVES", "CITY"];

// --- AUTHENTICATION ENDPOINT ---
app.post('/auth/join', (req, res) => {
    const { username, roomCode, hwid } = req.body;

    // 1. Validate Room Code
    if (!VALID_ROOMS.includes(roomCode.toUpperCase())) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid Room Code. Use FOREST, STUMP, CAVES, or CITY." 
        });
    }

    // 2. Simple Authentication / Registration
    // Generate a temporary session token
    const sessionToken = crypto.randomBytes(16).toString('hex');

    activePlayers.set(username, {
        room: roomCode.toUpperCase(),
        hwid: hwid,
        token: sessionToken,
        lastActive: Date.now()
    });

    console.log(`[AUTH] Player ${username} joined room ${roomCode}`);

    res.json({
        success: true,
        token: sessionToken,
        message: "Authenticated successfully"
    });
});

// --- HEARTBEAT / PLAYER COUNT ---
app.get('/api/status', (req, res) => {
    res.json({
        totalOnline: activePlayers.size,
        rooms: VALID_ROOMS
    });
});

// --- CLEANUP (Remove inactive players every 60s) ---
setInterval(() => {
    const now = Date.now();
    for (let [user, data] of activePlayers.entries()) {
        if (now - data.lastActive > 60000) {
            activePlayers.delete(user);
        }
    }
}, 60000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`GTag Backend Securely Running on Port ${PORT}`);
});
