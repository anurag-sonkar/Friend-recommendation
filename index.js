const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const db = require("./config/dbConnection");
const port = process.env.PORT || 5000;

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());


// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Server Start
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
