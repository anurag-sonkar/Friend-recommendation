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
app.use(cors({
    origin: "*", // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']

}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// roues
app.use('/auth', authRoutes);
app.use('/user', userRoutes);


// Server Start
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${BASE_URL}:${PORT}`);
    // console.log(`Server running on port http://localhost:${PORT}`);
});
