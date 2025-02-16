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
exports.updateUserInDB = void 0;
const schema_1 = require("../models/schema");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cookie_1 = require("../lib/cookie");
const deleteOldAvatar = (oldavatar) => {
    const oldAvatarPath = path_1.default.join(__dirname, `../../client/public/uploads/${oldavatar}`);
    fs_1.default.rmSync(oldAvatarPath);
};
const updateUserInDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = req.cookies['auth'];
    let oldavatar, oldUsername;
    if (token) {
        const user = (0, cookie_1.cookieValidator)(token);
        if (typeof user != 'string') {
            oldavatar = user.avatar;
            oldUsername = user.username;
        }
    }
    const { username: newUsername, name } = req.body;
    if (req.file && oldavatar != 'user.png') {
        deleteOldAvatar(oldavatar);
    }
    try {
        const avatar = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || '';
        yield (0, schema_1.updateUser)(oldUsername, newUsername, avatar, name);
        const loginCookie = (0, cookie_1.cookieGenerator)({ username: newUsername, name, avatar });
        res.cookie('auth', loginCookie, {
            httpOnly: true
        });
        res.json({
            statusCode: 200,
            message: 'User Updated'
        });
    }
    catch (error) {
        res.json({
            statusCode: 401,
            message: 'Server error'
        });
    }
});
exports.updateUserInDB = updateUserInDB;
