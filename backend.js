const express = require('express');
const app = express();
const PORT = 3000;

// 1. ALLOW THE WEBSITE TO TALK TO US (CORS)
// Browsers normally block websites from talking to servers. This fixes that.
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow any website to connect
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use(express.json());

// 2. THE MIDDLEWARE (The Bouncer)
// This time, we check if the user sent the correct password in the request
const checkPermission = (req, res, next) => {
    const userPassword = req.query.password; // We look for ?password=... in the URL

    // The secret password is "pizza"
    if (userPassword === 'pizza') {
        next(); // Allow access
    } else {
        // Deny access
        res.status(403).json({ message: "⛔ ACCESS DENIED: You cannot use this." });
    }
};

// 3. THE ROUTES
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// The Protected Route
app.get('/secret-menu', checkPermission, (req, res) => {
    res.status(200).json({ message: "🎉 ACCESS GRANTED: Welcome to the Secret Menu!" });
});

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
