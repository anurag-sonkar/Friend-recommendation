const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const db = require("./config/dbConnection");
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());


// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Server Start
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
