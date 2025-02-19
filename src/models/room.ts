import mongoose from "mongoose";
import { addRoomToUser, removeRoomToUser } from "./schema";
import { Rooms } from "../types/Rooms";
import { cookieGenerator } from "../lib/cookie";
import { getRoomsFromCookie } from "../controllers/fetch/getRoomsFromCookie";

const roomSchema = new mongoose.Schema<Rooms>({
    name: String,
    avatar: String,
    createBy: String,
    isPrivate: Boolean,
    members: Array<String>
})

const roomModel = mongoose.model<Rooms>('rooms', roomSchema)

export const addRoom = async ({ name, avatar, createBy, isPrivate }: Rooms, roomCookie: string) => {
    try {
        avatar = `/rooms/${avatar}`
        const room = await roomModel.create({
            name,
            avatar,
            createBy,
            isPrivate,
            members: [createBy]
        })
        // add room to user
        await addRoomToUser(createBy, name, room._id.toHexString())
        // change cookie
        const existedRooms = getRoomsFromCookie(roomCookie) || []
        const newRooms = [...existedRooms, {
            name,
            _id: room._id,
            avatar
        }]
        return {
            _id: room._id,
            totalMembers: newRooms.length,
            cookie: cookieGenerator({ rooms: newRooms })
        }
    } catch (error) {
        console.log('Error : ', error);
        throw new Error("Database not responding while inserting room");
    }
}


export const roomDelete = async (username: string, roomId: string, roomCookie: string) => {
    try {
        await roomModel.findByIdAndUpdate(roomId, {
            $pull: {
                members: username
            }
        }) // If remaining user=0, delete entire room document

        // remove that room from user
        await removeRoomToUser(username, roomId)
        // change cookie
        const existedRooms = getRoomsFromCookie(roomCookie) || []
        const newRooms = existedRooms.filter(room => room.roomId != roomId)
        console.log(newRooms);

        return cookieGenerator({ rooms: newRooms })
    } catch (error) {
        console.log('Error : ', error);
        throw new Error("Database not responding while inserting room");
    }
}