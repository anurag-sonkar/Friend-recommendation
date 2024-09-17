const express = require('express');
const {app,server} = require('./socket/socket')
// const {createServer} = require('http')
// const {Server} = require('socket.io')
// const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// const app = express();
// const server = createServer(app)
// const io = new Server(server)
// const io = socketIo(server, {
//     cors: {
//         origin: "http://localhost:5173", // Update this to match your frontend's origin
//         methods: ["GET", "POST"]
//     }
// });
const db = require("./config/dbConnection");
const port = process.env.PORT || 5000;

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());

// roues
app.use('/auth', authRoutes);
app.use('/user', userRoutes);


// Store mapping of userId to socketId
// let userSocketMap = new Map();
// // Handle socket connections
// io.on('connection', (socket) => {
//     console.log('New client connected:', socket.id);

//     socket.on('register', (userId) => {
//         userSocketMap.set(userId, socket.id); // Use .set() for Map
//         // console.log(`User ${userId} is associated with socket ${socket.id}`);
//         console.log(userSocketMap)
//     });

//     socket.on('disconnect', () => {
//         for (let [userId, socketId] of userSocketMap) {
//             if (socketId === socket.id) {
//                 userSocketMap.delete(userId); // Use .delete() for Map
//                 console.log(`Socket ${socket.id} disconnected, removing user ${userId}`);
//                 break;
//             }
//         }
//     });
// });

// Routes
// app.use('/auth', authRoutes);
// app.use('/user', (req, res, next) => {
//     req.io = io;
//     req.userSocketMap = userSocketMap;
//     next();
// }, userRoutes);

// Server Start
server.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
