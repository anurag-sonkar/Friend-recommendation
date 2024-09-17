const express = require('express');
const {app,server} = require('./socket/socket')
const cors = require('cors');
require('dotenv').config();

const db = require("./config/dbConnection");
const port = process.env.PORT || 5000;

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());

// roues
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Server Start
server.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
