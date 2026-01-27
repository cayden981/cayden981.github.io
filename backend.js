const express = require('express');
const app = express();
const PORT = 3000;

// --- 1. THE SETTING ---
// Change this to 'true' to let them in, or 'false' to block them.
// In a real app, this would come from a database login.
const isUserAdmin = false; 

// --- 2. THE BOUNCER (Middleware) ---
const checkPermission = (req, res, next) => {
    console.log("Checking ID...");

    if (isUserAdmin) {
        // If allowed, run the 'next' function to let them through
        next(); 
    } else {
        // If NOT allowed, stop them right here and show the error page
        res.status(403).send(`
            <h1 style="color: red; text-align: center; margin-top: 50px;">
                🚫 ACCESS DENIED
            </h1>
            <p style="text-align: center;">
                You cannot use this menu. You do not have permission.
            </p>
            <div style="text-align: center;">
                <a href="/">Go Back Home</a>
            </div>
        `);
    }
};

// --- 3. THE ROUTES ---

// Public Route (Everyone can see this)
app.get('/', (req, res) => {
    res.send('<h1>Home Page</h1><p>Welcome! Try going to <a href="/secret-menu">The Secret Menu</a></p>');
});

// Protected Route (The Bouncer protects this!)
// Notice we put 'checkPermission' in the middle
app.get('/secret-menu', checkPermission, (req, res) => {
    res.send('<h1>🎉 The Secret Menu</h1><p>Welcome, Admin! You can use this feature.</p>');
});

// --- 4. START SERVER ---
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
