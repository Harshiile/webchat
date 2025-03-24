"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomsFromCookie = void 0;
const cookie_1 = require("../../lib/cookie");
const getRoomsFromCookie = (roomToken) => {
    if (roomToken) {
        const roomsPayload = (0, cookie_1.cookieValidator)(roomToken);
        if (typeof (roomsPayload) != 'string')
            return roomsPayload.rooms;
        return [];
    }
    return [];
};
exports.getRoomsFromCookie = getRoomsFromCookie;
