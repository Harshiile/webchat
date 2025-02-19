import { cookieValidator } from "../../lib/cookie";

interface RoomsInCookie {
    roomId: string,
    roomName: string
}

export const getRoomsFromCookie = (roomToken: string): Array<RoomsInCookie> => {
    if (roomToken) {
        const roomsPayload = cookieValidator(roomToken)
        if (typeof (roomsPayload) != 'string') return roomsPayload.rooms;
        return []
    }
    return [];
}