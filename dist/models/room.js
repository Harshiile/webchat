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
exports.roomDelete = exports.addRoom = void 0;
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
        yield (0, schema_1.addRoomToUser)(createBy, name, room._id.toHexString());
        // change cookie
        const existedRooms = (0, getRoomsFromCookie_1.getRoomsFromCookie)(roomCookie) || [];
        const newRooms = [...existedRooms, {
                name,
                _id: room._id,
                avatar
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
        console.log(newRooms);
        return (0, cookie_1.cookieGenerator)({ rooms: newRooms });
    }
    catch (error) {
        console.log('Error : ', error);
        throw new Error("Database not responding while inserting room");
    }
});
exports.roomDelete = roomDelete;
