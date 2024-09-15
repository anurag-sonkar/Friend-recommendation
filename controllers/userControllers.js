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

}

module.exports = { handleUserSearch, handleSendFriendRequest }