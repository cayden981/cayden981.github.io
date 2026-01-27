const express = require('express');
const app = express();
const PORT = 3000;

// --- 1. SETTINGS ---
// This allows your HTML file to talk to this server
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// --- 2. THE BOUNCER (Middleware) ---
const checkPassword = (req, res, next) => {
    // We look for the password in the URL (e.g. ?password=pizza)
    const userPassword = req.query.password;

    console.log(`User tried password: ${userPassword}`); // Log what they typed

    if (userPassword === 'pizza') {
        next(); // Password matches! Let them in.
    } else {
        // Password wrong! Stop them here.
        res.status(403).json({ message: "⛔ WRONG PASSWORD: You cannot enter." });
    }
};

// --- 3. THE ROUTES ---

// A simple test route
app.get('/', (req, res) => {
    res.send("Backend is running! Go to your index.html file.");
});

// The Secret Menu (Protected by 'checkPassword')
app.get('/secret-menu', checkPassword, (req, res) => {
    res.status(200).json({ 
        message: "🎉 ACCESS GRANTED: Here is the secret menu!",
        items: ["Golden Burger", "Diamond Fries", "Invisible Soda"]
    });
});

// --- 4. START SERVER ---
app.listen(PORT, () => {
    console.log(`-----------------------------------------------`);
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`   Password is: pizza`);
    console.log(`-----------------------------------------------`);
});
