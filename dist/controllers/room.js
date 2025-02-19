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
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomDeleteController = exports.roomController = void 0;
const room_1 = require("../models/room");
const roomController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, isPrivate, username } = req.body;
    const avatar = req.file ? req.file.filename : 'user.png';
    try {
        if (!username)
            throw new Error("Server Error");
        const { cookie, _id, totalMembers } = yield (0, room_1.addRoom)({ name, avatar, createBy: username, isPrivate }, req.cookies['rooms']);
        res.cookie('rooms', cookie);
        res.json({
            statusCode: 200,
            message: 'Room Created Successfully',
            data: [
                {
                    name,
                    avatar: `/rooms/${avatar}`,
                    _id,
                    totalMembers
                }
            ]
        });
    }
    catch (error) {
        console.log('Error at roomController : ', error);
        res.json({
            statusCode: 400,
            message: 'Server Error'
        });
    }
});
exports.roomController = roomController;
const roomDeleteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, username } = req.body;
    try {
        const roomsToken = yield (0, room_1.roomDelete)(username, roomId, req.cookies['rooms']);
        res.cookie('rooms', roomsToken);
        res.json({
            statusCode: 200,
            message: 'Room Deleted Successfully'
        });
    }
    catch (error) {
        console.log('Error at roomController : ', error);
        res.json({
            statusCode: 400,
            message: 'Server Error'
        });
    }
});
exports.roomDeleteController = roomDeleteController;
