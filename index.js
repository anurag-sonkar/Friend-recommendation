const express = require('express');
const { app, server } = require('./socket/socket')
const cors = require('cors');
require('dotenv').config();

const db = require("./config/dbConnection");
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "https://66e991a48b1f930d47bc66e6--super-cheesecake-589752.netlify.app/", // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// roues
app.use('/auth', authRoutes);
app.use('/user', userRoutes);


// Server Start
server.listen(PORT, () => {
    console.log(`Server running on port ${BASE_URL}:${PORT}`);
    // console.log(`Server running on port http://localhost:${PORT}`);
});
