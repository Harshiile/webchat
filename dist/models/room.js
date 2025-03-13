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
exports.roomJoin = exports.isRoomExists = exports.roomDelete = exports.addRoom = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema_1 = require("./schema");
const cookie_1 = require("../lib/cookie");
const getRoomsFromCookie_1 = require("../controllers/fetch/getRoomsFromCookie");
const roomSchema = new mongoose_1.default.Schema({
    name: String,
    avatar: String,
    createBy: String,
    isPrivate: Boolean,
    members: (Array)
});
const roomModel = mongoose_1.default.model('rooms', roomSchema);
const addRoom = ({ name, avatar, createBy, isPrivate }, roomCookie) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        avatar = `/rooms/${avatar}`;
        const room = yield roomModel.create({
            name,
            avatar,
            createBy,
            isPrivate,
            members: [createBy]
        });
        // add room to user
        yield (0, schema_1.addRoomToUser)(createBy, room._id);
        // change cookie
        const existedRooms = (0, getRoomsFromCookie_1.getRoomsFromCookie)(roomCookie) || [];
        const newRooms = [...existedRooms, {
                name,
                roomId: room._id,
                avatar,
                isPrivate,
                totalMembers: (_a = room.members) === null || _a === void 0 ? void 0 : _a.length
            }];
        return {
            _id: room._id,
            totalMembers: newRooms.length,
            cookie: (0, cookie_1.cookieGenerator)({ rooms: newRooms })
        };
    }
    catch (error) {
        console.log('Error : ', error);
        throw new Error("Database not responding while inserting room");
    }
});
exports.addRoom = addRoom;
const roomDelete = (username, roomId, roomCookie) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield roomModel.findByIdAndUpdate(roomId, {
            $pull: {
                members: username
            }
        }); // If remaining user=0, delete entire room document
        // remove that room from user
        yield (0, schema_1.removeRoomToUser)(username, roomId);
        // change cookie
        const existedRooms = (0, getRoomsFromCookie_1.getRoomsFromCookie)(roomCookie) || [];
        const newRooms = existedRooms.filter(room => room.roomId != roomId);
        return { newRooms, roomsToken: (0, cookie_1.cookieGenerator)({ rooms: newRooms }) };
    }
    catch (error) {
        console.log('Error : ', error);
        throw new Error("Database not responding while inserting room");
    }
});
exports.roomDelete = roomDelete;
const isRoomExists = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const roomExist = yield roomModel.findById(roomId);
    return roomExist ? true : false;
});
exports.isRoomExists = isRoomExists;
const roomJoin = (username, roomId, roomCookie) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    // 1. Check whether room is exist or not
    try {
        const roomExist = yield roomModel.findById(roomId);
        if (roomExist) {
            try {
                yield roomModel.findByIdAndUpdate(roomId, {
                    $push: {
                        members: username
                    }
                });
                // change cookie
                const existedRooms = (0, getRoomsFromCookie_1.getRoomsFromCookie)(roomCookie) || [];
                const newRoom = {
                    name: roomExist.name,
                    avatar: roomExist.avatar,
                    roomId: roomExist._id.toString(),
                    isPrivate: roomExist.isPrivate,
                    totalMembers: ((_b = roomExist.members) === null || _b === void 0 ? void 0 : _b.length) || 0 + 1
                };
                const newRooms = [...existedRooms, newRoom];
                return { newRoom, roomsToken: (0, cookie_1.cookieGenerator)({ rooms: newRooms }) };
            }
            catch (error) {
                console.log('Error : ', error);
                throw new Error("Database not responding while joining room");
            }
        }
        return {
            // Room not exist
            error: true,
            message: 'Room not exist'
        };
    }
    catch (error) {
        console.log('Error : ', error);
        throw new Error("Database not responding while fetching existing room");
    }
});
exports.roomJoin = roomJoin;
