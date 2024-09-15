const express = require('express');
const router = express.Router();
const { handleUserSearch, handleSendFriendRequest, handleAcceptFriendRequest, handleRejectFriendRequest } = require('../controllers/userControllers');
const authenticate = require('../middlewares/checkAuthentication');

// auth
router.get('/search', authenticate , handleUserSearch);
router.post('/send-request', authenticate , handleSendFriendRequest);
router.post('/accept-request',authenticate, handleAcceptFriendRequest);
router.post('/reject-request',authenticate, handleRejectFriendRequest);

module.exports = router;
