import express from "express";
import router from "./routes/post";
import { connectDB } from "./lib/connect";
require('dotenv').config();
import cors from 'cors'
import CookieParser from 'cookie-parser'
import { Server } from 'socket.io'
import { createServer } from 'http'

const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(CookieParser())
app.use('/api/v0', router)


const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
});


const members = new Map();

io.on('connection', (socket) => {
    console.log('a user connected : ', socket.id);

    socket.on('msg-sent', async ({ msg, room }) => {

        // const roomId=members.get(roomId)
        // io.to(room).emit('msg-receive', { msg })
    })
    socket.on('room-create', ({ roomId }) => {
        socket.join(roomId);
        console.log(io.sockets.adapter.rooms);
        // const existedMembers = members.get(roomId);
        // members.set(roomId, [...existedMembers, userId])
    })
    socket.on('room-join', ({ roomId }) => {
        socket.join(roomId);
        console.log(io.sockets.adapter.rooms);
    })
    socket.on('initial-join', ({ rooms }) => {
        for (const room of rooms) {
            socket.join(room)
        }
        console.log(io.sockets.adapter.rooms);

    })
    socket.on('room-leave', ({ roomId }) => {
        socket.leave(roomId);
        // const existedMembers = members.get(roomId).filter((user: string) => user != userId);
        // members.set(roomId, existedMembers)
    })
});


connectDB()
    .then(res => {
        const PORT = process.env.PORT || 5000
        server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
    })
