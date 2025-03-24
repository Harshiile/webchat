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
        await addRoomToUser(createBy, room._id)
        // change cookie
        const existedRooms = getRoomsFromCookie(roomCookie) || []
        const newRooms = [...existedRooms, {
            name,
            roomId: room._id,
            avatar,
            isPrivate,
            totalMembers: room.members?.length
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


export const roomDelete = async (username: string, roomId: mongoose.Types.ObjectId, roomCookie: string) => {
    try {
        const deletedRoom = await roomModel.findByIdAndUpdate(roomId, {
            $pull: {
                members: username
            }
        })
        if (deletedRoom?.members && deletedRoom.members.length <= 1) {
            // If remaining user=0, delete entire room document 
            await roomModel.findByIdAndDelete(deletedRoom._id)
        }

        // remove that room from user
        await removeRoomToUser(username, roomId)
        // change cookie
        const existedRooms = getRoomsFromCookie(roomCookie) || []
        const newRooms = existedRooms.filter(room => room.roomId != roomId)
        return { newRooms, roomsToken: cookieGenerator({ rooms: newRooms }) }
    } catch (error) {
        console.log('Error : ', error);
        throw new Error("Database not responding while inserting room");
    }
}

export const isRoomExists = async (roomId: mongoose.Types.ObjectId): Promise<boolean> => {
    const roomExist = await roomModel.findById(roomId);
    return roomExist ? true : false;
}
export const roomJoin = async (username: string, roomId: mongoose.Types.ObjectId, roomCookie: string) => {

    // 1. Check whether room is exist or not
    try {
        const roomExist = await roomModel.findById(roomId);
        if (roomExist) {
            try {
                if (roomExist?.members?.includes(username)) {
                    const existedRooms = getRoomsFromCookie(roomCookie) || []
                    return {
                        // User already in room
                        error: true,
                        message: 'You already in this room',
                        roomsToken: roomCookie
                    }
                }
                await roomModel.findByIdAndUpdate(roomId, {
                    $push: {
                        members: username
                    }
                })

                // change cookie
                const existedRooms = getRoomsFromCookie(roomCookie) || []
                console.log('existedRooms : ', existedRooms);

                const newRoom = {
                    name: roomExist.name,
                    avatar: roomExist.avatar,
                    roomId: roomExist._id.toString(),
                    isPrivate: roomExist.isPrivate,
                    totalMembers: roomExist.members?.length || 0 + 1
                }
                const newRooms = [...existedRooms, newRoom]
                return { newRoom, roomsToken: cookieGenerator({ rooms: newRooms }) }
            } catch (error) {
                console.log('Error : ', error);
                throw new Error("Database not responding while joining room");
            }
        }
        else return {
            // Room not exist
            error: true,
            message: 'Room not exist'
        }
    } catch (error) {
        console.log('Error : ', error);
        throw new Error("Database not responding while fetching existing room");
    }
}

export const getMembers = async (roomId: mongoose.Types.ObjectId): Promise<Array<Object>> => {
    console.log('getMembers > roomId : ', roomId);

    return await roomModel.aggregate(
        [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(roomId),
                },
            },
            {
                $unwind: "$members"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "members",
                    foreignField: "username",
                    as: "result"
                }
            },
            {
                $project: {
                    members: { $first: "$result" }
                }
            },
            {
                $project: {
                    name: "$members.name",
                    username: "$members.username",
                    avatar: "$members.avatar",
                    id: "$members._id"
                }
            },
            {
                $unset: "_id"
            }
        ]
    )
}