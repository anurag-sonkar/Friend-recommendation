const express = require('express');
const { createServer } = require('http')
const { Server } = require('socket.io')
require('dotenv').config();

const app = express();
const server = createServer(app)

const io = new Server(server , {
    cors: {
            origin: "*", // frontend's origin - allowing all    
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