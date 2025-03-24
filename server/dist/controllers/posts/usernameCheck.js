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
exports.usernameCheck = void 0;
const schema_1 = require("../../models/schema");
const usernameCheck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    try {
        const [usernameExist] = yield schema_1.userModel.find({ username });
        if (!usernameExist) {
            res.json({
                statusCode: 200,
                message: 'Successfully Username Created'
            });
        }
        else {
            res.json({
                statusCode: 401,
                message: 'Username already taken'
            });
        }
    }
    catch (error) {
        res.json({
            statusCode: 401,
            message: 'Server error'
        });
    }
});
exports.usernameCheck = usernameCheck;
