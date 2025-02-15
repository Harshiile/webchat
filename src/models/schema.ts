import mongoose from "mongoose";
import { UserAuth } from "../types/UserAuth";

const userSchema = new mongoose.Schema<UserAuth>({
    email: {
        type: String,
        unique: true
    },
    password: String,
    username: String,
    avatar: String,
    name: String
})

export const userModel = mongoose.model<UserAuth>('users', userSchema)