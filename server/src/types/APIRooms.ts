import mongoose from "mongoose";

export interface APIRooms {
    name: string,
    avatar: string,
    roomId: mongoose.Types.ObjectId,
    totalMembers: number,
    isPrivate: boolean
}