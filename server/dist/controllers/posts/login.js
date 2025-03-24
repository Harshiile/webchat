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
exports.loginController = void 0;
const schema_1 = require("../../models/schema");
const cookie_1 = require("../../lib/cookie");
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const [user] = yield schema_1.userModel.find({ email });
    if (user) {
        if (user.password == password) {
            const { name, avatar } = user;
            const loginCookie = (0, cookie_1.cookieGenerator)({ name, avatar });
            res.cookie('auth', loginCookie, {
                httpOnly: true
            });
            res.json({
                statusCode: 200,
                message: 'Login Successfully',
                rediectUrl: '/profile'
            });
        }
        else
            res.json({
                statusCode: 401,
                message: 'Password Incorrect'
            });
    }
    else
        res.json({
            statusCode: 401,
            message: 'User not found'
        });
});
exports.loginController = loginController;
