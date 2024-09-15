const express = require('express');
const router = express.Router();
const { handleUserSearch, handleSendFriendRequest } = require('../controllers/userControllers')

// auth
router.get('/search', handleUserSearch);
router.post('/sendrequest', handleSendFriendRequest);

module.exports = router;
