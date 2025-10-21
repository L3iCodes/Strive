import { Server } from "socket.io";
import http from 'http';
import express from "express";
import dotenv from "dotenv";
import { findBoardAndPopulate } from "../services/board.service.js";
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: process.env.ORIGIN,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log("A user has connected - ", socket.id);

    socket.on('JOIN_BOARD', (boardId) => {
        socket.join(boardId);
        console.log(`User: ${socket.id} JOINED-${boardId}`)

        if (typeof callback === 'function') {
            callback({ status: 'ok' });
        }
    })

    socket.on('UPDATE_BOARD', async (payload) => {
        const { boardId } = payload;
        const board = await findBoardAndPopulate(boardId);
        console.log('Getting board', board)
        socket.to(boardId).emit('UPDATE_BOARD', { board });
        console.log("UPDATING BOARD BY ", socket.id)
    })

    socket.on('LEAVE_BOARD', (boardId) => {
        socket.leave(boardId);
    })

    socket.on("disconnect", () => {
        console.log('A user has disconnected - ', socket.id)
    })
})

export { io, app, server }