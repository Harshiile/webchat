import { Request, Response } from 'express'
import { APIResponse } from '../types/APIResponse'
import { addRoom, roomDelete, roomJoin } from '../models/room';
import { Rooms } from '../types/Rooms';
import mongoose from 'mongoose';
import { APIRooms } from '../types/APIRooms';
import { addRoomToUser } from '../models/schema';

export const roomController = async (req: Request<{}, {}, Rooms & { username: string }>, res: Response<APIResponse>) => {
    const { name, isPrivate, username } = req.body;
    const avatar = req.file ? req.file.filename : 'user.png';
    try {
        if (!username) throw new Error("Server Error");
        const { cookie, _id, totalMembers } = await addRoom({ name, avatar, createBy: username, isPrivate }, req.cookies['rooms'])
        res.cookie('rooms', cookie)
        const returnedRoom: APIRooms = {
            name,
            avatar: `/rooms/${avatar}`,
            roomId: _id,
            isPrivate,
            totalMembers
        }
        res.json({
            statusCode: 200,
            message: 'Room Created Successfully',
            data: [
                returnedRoom
            ]
        })
    } catch (error) {
        console.log('Error at roomController : ', error);
        res.json({
            statusCode: 400,
            message: 'Server Error'
        })
    }
}
export const roomDeleteController = async (req: Request<{}, {}, { roomId: mongoose.Types.ObjectId, username: string }>, res: Response<APIResponse>) => {
    const { username, roomId } = req.body;
    try {
        const { roomsToken, newRooms } = await roomDelete(username, roomId, req.cookies['rooms'])
        res.cookie('rooms', roomsToken)
        res.json({
            statusCode: 200,
            message: 'Room Deleted Successfully',
            data: [
                newRooms
            ]
        })
    } catch (error) {
        console.log('Error at roomController : ', error);
        res.json({
            statusCode: 400,
            message: 'Server Error'
        })
    }
}
export const roomJoinController = async (req: Request<{}, {}, { roomId: mongoose.Types.ObjectId, username: string }>, res: Response<APIResponse>) => {

    const { username } = req.body;
    let { roomId } = req.body;
    roomId = new mongoose.Types.ObjectId(roomId);
    //add roomId to userModel
    addRoomToUser(username, roomId);
    // add userId to members array in roomModel
    const { roomsToken, newRoom } = await roomJoin(username, roomId, req.cookies['rooms'])
    res.cookie('rooms', roomsToken)
    res.json({
        statusCode: 200,
        message: 'Room Joined Successfully',
        data: [
            newRoom
        ]
    })
}