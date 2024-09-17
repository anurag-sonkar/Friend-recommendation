const express = require('express');
const { createServer } = require('http')
const { Server } = require('socket.io')

const app = express();
const server = createServer(app)

const io = new Server(server , {
    cors: {
            origin: "http://localhost:5173", // frontend's origin
            methods: ["GET", "POST"]
        }
})


const userSocketMap = {}; // {userId->socketId}

const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId
    if (userId !== undefined) {
        userSocketMap[userId] = socket.id;
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));
    console.log(userSocketMap)
    socket.on('disconnect', () => {
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })

})


module.exports = { app, io, server, getReceiverSocketId }