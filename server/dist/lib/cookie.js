"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieValidator = exports.cookieGenerator = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const cookieGenerator = (payload) => {
    return process.env.JWT_SECRET ? (0, jsonwebtoken_1.sign)(payload, process.env.JWT_SECRET) : "";
};
exports.cookieGenerator = cookieGenerator;
const cookieValidator = (token) => {
    return process.env.JWT_SECRET ? (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET) : "";
};
exports.cookieValidator = cookieValidator;
