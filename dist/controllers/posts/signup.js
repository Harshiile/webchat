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
exports.signUpController = void 0;
const schema_1 = require("../../models/schema");
const signUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username, name } = req.body;
    const avatar = req.file ? req.file.filename : 'user.png';
    const [user] = yield schema_1.userModel.find({ email });
    if (!user) {
        try {
            yield schema_1.userModel.create({
                email,
                password,
                username,
                avatar,
                name
            });
            res.json({
                statusCode: 200,
                message: 'Signup Successfully'
            });
        }
        catch (error) {
            res.json({
                statusCode: 401,
                message: 'Server error'
            });
        }
    }
    else
        res.json({
            statusCode: 401,
            message: 'User already exists'
        });
});
exports.signUpController = signUpController;
