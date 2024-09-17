const express = require('express');
const { app, server } = require('./socket/socket')
const path = require('path')
const cors = require('cors');
require('dotenv').config();

const db = require("./config/dbConnection");
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL
const __dirname = path.resolve()

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

// roues
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.use(express.static(path.join(__dirname , "/frontend/dist")))
app.get('*' , (req,res)=>{
    res.sendFile(path.resolve(__dirname , "frontend" , "build" , "index.html"))
})

// Server Start
server.listen(PORT, () => {
    console.log(`Server running on port ${BASE_URL}:${PORT}`);
});
