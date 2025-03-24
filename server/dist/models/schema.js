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
exports.getRoomsFromDB = exports.removeRoomToUser = exports.addRoomToUser = exports.updateUser = exports.getUserByUsername = exports.getUserByEmail = exports.userAdd = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    username: {
        type: String,
        unique: true
    },
    avatar: String,
    name: String,
    rooms: (Array)
});
const userModel = mongoose_1.default.model('users', userSchema);
const userAdd = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, username, name, avatar }) {
    try {
        yield userModel.create({
            email,
            password,
            username,
            avatar,
            name,
            rooms: []
        });
    }
    catch (error) {
        throw new Error("Database not responding while inserting user data");
    }
});
exports.userAdd = userAdd;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [user] = yield userModel.find({ email });
        return user;
    }
    catch (error) {
        throw new Error("Database not responding while fetching user data");
    }
});
exports.getUserByEmail = getUserByEmail;
const getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [user] = yield userModel.find({ username });
        return user;
    }
    catch (error) {
        throw new Error("Database not responding while fetching user data");
    }
});
exports.getUserByUsername = getUserByUsername;
const updateUser = (oldusername, newusername, avatar, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userModel.updateOne({ username: oldusername }, {
            $set: {
                username: newusername,
                avatar,
                name
            }
        });
        return true;
    }
    catch (error) {
        throw new Error("Database not responding while updating user data");
    }
});
exports.updateUser = updateUser;
const addRoomToUser = (username, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userModel.findOneAndUpdate({ username }, {
            $push: {
                rooms: roomId
            }
        });
    }
    catch (error) {
        throw new Error("Database not responding while fetching user data");
    }
});
exports.addRoomToUser = addRoomToUser;
const removeRoomToUser = (username, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userModel.findOneAndUpdate({ username }, {
            $pull: {
                rooms: new mongoose_1.default.Types.ObjectId(roomId)
            }
        });
    }
    catch (error) {
        throw new Error("Database not responding while fetching user data");
    }
});
exports.removeRoomToUser = removeRoomToUser;
const getRoomsFromDB = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userModel.aggregate([
        {
            $match: {
                username,
            },
        },
        {
            $unwind: "$rooms",
        },
        {
            $lookup: {
                from: "rooms",
                localField: "rooms",
                foreignField: "_id",
                as: "result",
            },
        },
        {
            $project: {
                rooms: { $first: "$result" },
            },
        },
        {
            $project: {
                name: "$rooms.name",
                avatar: "$rooms.avatar",
                isPrivate: "$rooms.isPrivate",
                roomId: "$rooms._id",
                members: "$rooms.members",
            },
        },
        {
            $unset: "_id",
        },
    ]);
});
exports.getRoomsFromDB = getRoomsFromDB;
