const User = require('../models/user')

const handleUserSearch = async (req, res) => {

    const { query } = req.query;

    if (!query) return res.status(400).json({ message: 'Search query is required' });

    try {
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } }, // Case-insensitive search : i
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('_id username email');

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Error searching users' });
    }
}


const handleSendFriendRequest = async(req,res)=>{
    const { recipientId } = req.body; // friend id 
    const senderId = req.user._id;

    try {
        const recipient = await User.findById(recipientId);
        // const sender = await User.findById(senderId);

        if (!recipient) return res.status(404).json({ message: 'User not found' });
        if (recipient.friendRequests.includes(senderId)) return res.status(400).json({ message: 'Friend request already sent' });

        recipient.friendRequests.push(senderId);
        await recipient.save();

        res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending friend request' });
    }
}


/* for Accepting Friend Requests:
When a user accepts a friend request, we need to:
Add the sender to the recriver friend lst.
Add the receiver to the sender friend lst.
Remvve the request from the receiver’s friendRequests lst.
*/

const handleAcceptFriendRequest = async(req,res)=>{
    const { senderId } = req.body; // ID of the user who sent the request
    const receiverId = req.user._id; // loggned user

    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) return res.status(404).json({ message: 'User not found' });

        // Check if the friend request exists
        if (!receiver.friendRequests.includes(senderId)) {
            return res.status(400).json({ message: 'Friend request not found' });
        }

        // Add each other as friends
        receiver.friends.push(senderId);
        sender.friends.push(receiverId);

        // Remove the friend request from the receiver's list
        receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== senderId.toString());

        // Save both users
        await receiver.save();
        await sender.save();

        res.status(200).json({ message: 'Friend request accepted', friends: receiver.friends });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting friend request' });
    }
}


/*
Rejecting Friend Requests:
If the user rejects the request we just remove the sender id from the friendRequests array
*/

const handleRejectFriendRequest = async(req,res)=>{
    const { senderId } = req.body; // ID of the user who sent the request
    const receiverId = req.user._id;

    try {
        const receiver = await User.findById(receiverId);

        if (!receiver) return res.status(404).json({ message: 'User not found' });

        // Remove the sender from the friendRequests array
        receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== senderId.toString());

        await receiver.save();

        res.status(200).json({ message: 'Friend request rejected' });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting friend request' });
    }
}

/* 
getFriendList : basic findById then populate friends -> username , email
Unfriend a User: 
1.Remove the friend from the users friends array.
2.Remove the user from the friends friendds array.
*/

const handleGetFriendList = async(req,res)=>{
    const userId = req.user._id;

    try {
        const user = await User.findById(userId).populate('friends', 'username email');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ friends: user.friends });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching friend list' });
    }
}


const handleUnfriend = async(req,res)=>{
    const { friendId } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) return res.status(404).json({ message: 'User not found' });

        // Remove friend from user's friends array
        user.friends = user.friends.filter(id => id.toString() !== friendId.toString());

        // Remove user from friend's friends array
        friend.friends = friend.friends.filter(id => id.toString() !== userId.toString());

        await user.save();
        await friend.save();

        res.status(200).json({ message: 'Unfriended successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error unfriending user' });
    }
}


const getFriendRecommendations = async (req, res) => {
    const userId = req.user._id;
    try {
        // Fetch current user's friends
        const currentUser = await User.findById(userId).populate('friends', 'username');
        if (!currentUser) return res.status(404).json({ message: 'User not found' });
        
        const userFriends = currentUser.friends.map(friend => friend._id.toString());
        console.log("userFriends", userFriends)
        
        // Find all users except the current user
        const allUsers = await User.find({ _id: { $ne: userId } });
        console.log("allUsers" , allUsers)

        let recommendations = [];

        // Loop through all users to find mutual friends
        for (let user of allUsers) {
            if (userFriends.includes(user._id.toString())) continue; // Skip users who are already friends

            // Find mutual friends
            const mutualFriends = user.friends.filter(friendId => userFriends.includes(friendId).toString());

            console.log("mutualFriends", mutualFriends)

            if (mutualFriends.length > 0) {
                recommendations.push({
                    userId: user._id,
                    username: user.username,
                    mutualFriends: mutualFriends.length,  // Number of mutual friends
                });
            }
        }

        console.log("recommendations", recommendations)


        // Sort recommendations by number of mutual friends
        recommendations.sort((a, b) => b.mutualFriends - a.mutualFriends);

        res.status(200).json({ recommendations });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
};



module.exports = { handleUserSearch, handleSendFriendRequest, handleAcceptFriendRequest, handleRejectFriendRequest, handleGetFriendList, handleUnfriend, getFriendRecommendations }