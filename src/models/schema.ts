import mongoose from "mongoose";
import { UserAuth } from "../types/UserAuth";

const userSchema = new mongoose.Schema<UserAuth>({
    email: {
        type: String,
        unique: true
    },
    password: String,
    username: {
        type: String,
        unique: true
    },
    avatar: String,
    name: String,
    rooms: Array<mongoose.Types.ObjectId>
})

const userModel = mongoose.model<UserAuth>('users', userSchema)

export const userAdd = async ({ email, password, username, name, avatar }: UserAuth) => {
    try {
        await userModel.create({
            email,
            password,
            username,
            avatar,
            name,
            rooms: []
        })
    } catch (error) {
        throw new Error("Database not responding while inserting user data");
    }
}
export const getUserByEmail = async (email: string): Promise<UserAuth> => {
    try {
        const [user] = await userModel.find({ email })
        return user;
    } catch (error) {
        throw new Error("Database not responding while fetching user data");
    }
}
export const getUserByUsername = async (username: string): Promise<UserAuth> => {
    try {
        const [user] = await userModel.find({ username })
        return user;
    } catch (error) {
        throw new Error("Database not responding while fetching user data");
    }
}
export const updateUser = async (oldusername: string, newusername: string, avatar: string, name: string): Promise<boolean> => {
    try {
        await userModel.updateOne({ username: oldusername }, {
            $set: {
                username: newusername,
                avatar,
                name
            }
        })
        return true;
    } catch (error) {
        throw new Error("Database not responding while updating user data");
    }
}
export const addRoomToUser = async (username: string, roomId: mongoose.Types.ObjectId) => {
    try {
        await userModel.findOneAndUpdate({ username }, {
            $push: {
                rooms: roomId
            }
        })
    } catch (error) {
        throw new Error("Database not responding while fetching user data");
    }
}
export const removeRoomToUser = async (username: string, roomId: string) => {
    try {
        await userModel.findOneAndUpdate({ username }, {
            $pull: {
                rooms: {
                    roomId
                }
            }
        })
    } catch (error) {
        throw new Error("Database not responding while fetching user data");
    }
}

export const getRoomsFromDB = async (username: string): Promise<Array<Object>> => {
    return await userModel.aggregate(
        [
            {
                $unwind: '$rooms'
            },
            {
                $lookup: {
                    from: 'rooms',
                    localField: 'rooms',
                    foreignField: '_id',
                    as: 'result'
                }
            },
            {
                $project: {
                    roomDetails: { $first: '$result' }
                }
            },
            {
                $project: {
                    name: '$roomDetails.name',
                    avatar: '$roomDetails.avatar',
                    isPrivate: '$roomDetails.isPrivate',
                    roomId: '$roomDetails._id'
                }
            }
        ]
    )
}