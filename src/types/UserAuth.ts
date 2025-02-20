import mongoose from "mongoose"

type Id = mongoose.Types.ObjectId

export interface UserAuth {
    email: string,
    password: string,
    name: string,
    avatar: string,
    username: string,
    rooms?: Array<Id>
}