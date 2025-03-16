"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_1 = __importDefault(require("./routes/post"));
const connect_1 = require("./lib/connect");
require('dotenv').config();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/v0', post_1.default);
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
});
io.on('connection', (socket) => {
    console.log('a user connected : ', socket.id);
    socket.on('msg-sent', (_a) => __awaiter(void 0, [_a], void 0, function* ({ msg, room }) {
        msg.type = "ingoing";
        io.to(room).except(socket.id).emit('msg-receive', { msg, room });
    }));
    socket.on('room-create', ({ roomId }) => {
        socket.join(roomId);
        // const existedMembers = members.get(roomId);
        // members.set(roomId, [...existedMembers, userId])
    });
    socket.on('room-join', ({ roomId }) => {
        socket.join(roomId);
    });
    socket.on('initial-join', ({ rooms }) => {
        for (const room of rooms) {
            socket.join(room);
        }
    });
    socket.on('room-leave', ({ roomId }) => {
        socket.leave(roomId);
        // const existedMembers = members.get(roomId).filter((user: string) => user != userId);
        // members.set(roomId, existedMembers)
    });
});
(0, connect_1.connectDB)()
    .then(res => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
