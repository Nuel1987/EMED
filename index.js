//import packages
const express = require('express');
const session = require('express-session')
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

//set-up middleware
app.use(express.static(path.join(__dirname, '/')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

//Route
app.use('/auth', authRoutes)

//serve html pages
app.get('/register', (request, response) => {
    response.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/login', (request, response) => {
    response.sendFile(path.join(__dirname, 'login.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`)
});