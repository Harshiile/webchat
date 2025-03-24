"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataFromCookie = void 0;
const cookie_1 = require("./cookie");
const getDataFromCookie = (cookieName) => {
    return (0, cookie_1.cookieValidator)(cookieName);
};
exports.getDataFromCookie = getDataFromCookie;
