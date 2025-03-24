import mongoose from "mongoose";
import { cookieValidator } from "../../lib/cookie";

export interface RoomCookie {
    _id: string,
    name: string,
    avatar: string,
    isPrivate: boolean,
    roomId: mongoose.Types.ObjectId
}

export const getRoomsFromCookie = (roomToken: string): Array<RoomCookie> => {
    if (roomToken) {
        const roomsPayload = cookieValidator(roomToken)
        if (typeof (roomsPayload) != 'string') return roomsPayload.rooms;
        return []
    }
    return [];
}