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
exports.getRooms = void 0;
const cookie_1 = require("../../lib/cookie");
const schema_1 = require("../../models/schema");
const getRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomsToken = req.cookies['rooms'];
    if (roomsToken) {
        res.json({
            statusCode: 200,
            message: 'Fetching room successful',
            data: [
                (0, cookie_1.cookieValidator)(roomsToken)
            ]
        });
    }
    else {
        // fetch rooms from user table by username
        const user = (0, cookie_1.cookieValidator)(req.cookies['auth']);
        let roomsDetails;
        if (typeof (user) != 'string') {
            roomsDetails = yield (0, schema_1.getRoomsFromDB)(user.username);
            res.cookie('rooms', (0, cookie_1.cookieGenerator)({ roomsDetails }));
        }
        res.json({
            statusCode: 200,
            message: 'Fetching room from DB successful',
            data: [
                {
                    roomsDetails
                }
            ]
        });
    }
});
exports.getRooms = getRooms;
