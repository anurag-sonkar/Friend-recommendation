const USER = require('../models/user');
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
    // console.log(req.headers.authorization)
    if (!req.headers.authorization) return res.status(400).json({ error: "token not found", message: "required login" })
    try {
        const token = req.headers.authorization.split(" ")[1]; // while postman testing
        // const token = req.headers.authorization; // with frontend formm

        if (!token) {
            return res.status(401).json({ error: 'Authorization token not provided', message: "required login" });
        }

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const user = await USER.findOne({ _id: verifyToken._id });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user
        req.id = user._id
        next();

    } catch (error) {
        console.log(error)
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ status: 401, error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 401, error: 'Token expired' });
        }
        console.error('Authentication error:', error);
        return res.status(500).json({ status: 401, error: error.message });
    }
};

module.exports = authenticate;
