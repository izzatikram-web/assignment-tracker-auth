// index.js
// Main server file for Assignment Tracker

// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./passport-config');

const assignmentRoutes = require('./routes/assignments');
const authRoutes = require('./routes/auth');

const app = express();
app.set("trust proxy", 1); 

// ====== Connect to MongoDB ======
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// ====== Initialize Passport Strategies ======
initializePassport(passport);

// ====== Middleware ======

// Parse URL-encoded form data (from HTML forms)
app.use(express.urlencoded({ extended: false }));

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session middleware (needed for passport to keep users logged in)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'superSecretSessionKey',
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

// Make logged-in user available in all EJS views as "user"
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// ====== Routes ======

// Home page (splash page)
app.get('/', (req, res) => {
  // Render views/index.ejs
  res.render('index', { title: 'Home' });
});

// Login page (shows Google/GitHub buttons)
app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});


// Optional: simple login-failed page
app.get('/login-failed', (req, res) => {
  res.send('Login failed. Please try again.');
});

// Auth routes (/auth/google, /auth/github, /auth/logout)
app.use('/auth', authRoutes);

// Use assignment routes for any URL starting with /assignments
app.use('/assignments', assignmentRoutes);

// ====== Start Server ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
