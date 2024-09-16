const User = require('../models/user');
const bcrypt = require('bcryptjs')

const handleUserSignup = async (req, res) => {
    console.log(req.body)
    const { username, email, password } = req.body;

    if (!username || !email || !password) return res.status(400).json({ message: "username / email / password is required to register" })

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'user already exists' });

        const user = await User.create({ username, email, password });
        const token = await user.generateAuthtoken();
        console.log(user)

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token
        });
    } catch (error) {
        res.status(500).json({ message: `${error.message}` });
    }
}


const handleUserLogin = async (req, res) => {
    const { email, password } = req.body
    console.log(req.body)

    if (!email || !password) {
        return res.status(400).json({ message: "email and password are required" });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generating token
        const token = await user.generateAuthtoken();

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token
        });
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
}

module.exports = { handleUserSignup, handleUserLogin }