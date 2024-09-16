const express = require('express');
const router = express.Router();
const { handleUserSearch, handleSendFriendRequest, handleAcceptFriendRequest, handleRejectFriendRequest, handleGetFriendList, handleUnfriend, getFriendRecommendations } = require('../controllers/userControllers');
const authenticate = require('../middlewares/checkAuthentication');

// auth
router.get('/search', authenticate , handleUserSearch);
router.post('/send-request', authenticate , handleSendFriendRequest);
router.post('/accept-request',authenticate, handleAcceptFriendRequest);
router.post('/reject-request',authenticate, handleRejectFriendRequest);
router.get('/friends', authenticate, handleGetFriendList);  // To get the friend list
router.post('/unfriend', authenticate ,handleUnfriend);  // To unfriend a user

router.get('/recommendations',authenticate, getFriendRecommendations);  // Route for friend recommendations

module.exports = router;
