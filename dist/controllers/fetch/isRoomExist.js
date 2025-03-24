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
exports.IsRoomExistController = void 0;
const room_1 = require("../../models/room");
const mongoose_1 = __importDefault(require("mongoose"));
const IsRoomExistController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (mongoose_1.default.isValidObjectId(req.body.roomId)) {
        res.json({
            statusCode: 200,
            message: 'Is room exists?',
            data: [
                {
                    "isRoomExist": yield (0, room_1.isRoomExists)(new mongoose_1.default.Types.ObjectId(req.body.roomId))
                }
            ]
        });
    }
    else
        res.json({
            statusCode: 400,
            message: 'Room Link is not valid'
        });
});
exports.IsRoomExistController = IsRoomExistController;
