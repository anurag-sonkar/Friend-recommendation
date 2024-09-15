const express = require('express');
const router = express.Router();
const { handleUserSignup, handleUserLogin } = require('../controllers/authControllers')

// auth
router.post('/register', handleUserSignup);
router.post('/login', handleUserLogin );

module.exports = router;
