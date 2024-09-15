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
    const { recipientId } = req.body;
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

module.exports = { handleUserSearch, handleSendFriendRequest, handleAcceptFriendRequest, handleRejectFriendRequest }