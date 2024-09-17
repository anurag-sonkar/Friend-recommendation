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
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// roues
app.use('/auth', authRoutes);
app.use('/user', userRoutes);


// Server Start
server.listen(PORT, () => {
    console.log(`Server running on port ${BASE_URL}:${PORT}`);
});
