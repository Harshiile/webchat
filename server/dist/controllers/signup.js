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
exports.oAuthGoogleController = exports.signUpController = void 0;
const schema_1 = require("../models/schema");
const cookie_1 = require("../lib/cookie");
const signUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username, name } = req.body;
    const avatar = `/uploads/${req.file ? req.file.filename : 'user.png'}`;
    const user = yield (0, schema_1.getUserByEmail)(email);
    if (!user) {
        try {
            yield (0, schema_1.userAdd)({
                email,
                password,
                username,
                avatar,
                name
            });
            const loginCookie = (0, cookie_1.cookieGenerator)({ username, name, avatar });
            console.log(loginCookie);
            res.cookie('auth', loginCookie);
            res.json({
                statusCode: 200,
                message: 'Signup Successfully',
                redirectUrl: '/profile'
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
const oAuthGoogleController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username, name, avatar } = req.body.data;
    const user = yield (0, schema_1.getUserByEmail)(email);
    if (!user) {
        try {
            yield (0, schema_1.userAdd)({
                email,
                password,
                username,
                avatar,
                name
            });
            const loginCookie = (0, cookie_1.cookieGenerator)({ username, name, avatar });
            res.cookie('auth', loginCookie);
            res.json({
                statusCode: 200,
                message: 'Signup Successfully',
                redirectUrl: '/profile'
            });
        }
        catch (error) {
            res.json({
                statusCode: 401,
                message: 'Server error'
            });
        }
    }
    else {
        const loginCookie = (0, cookie_1.cookieGenerator)({ username: user.username, name: user.name, avatar: user.avatar });
        res.cookie('auth', loginCookie);
        res.json({
            statusCode: 200,
            message: 'Login Successfully',
            redirectUrl: '/profile'
        });
    }
});
exports.oAuthGoogleController = oAuthGoogleController;
