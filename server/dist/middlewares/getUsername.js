"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsername = void 0;
const cookie_1 = require("../lib/cookie");
const getUsername = (req, res, next) => {
    const token = req.cookies['auth'];
    if (token) {
        const user = (0, cookie_1.cookieValidator)(token);
        req.body.username = typeof (user) != 'string' ? user.username : null;
    }
    next();
};
exports.getUsername = getUsername;
