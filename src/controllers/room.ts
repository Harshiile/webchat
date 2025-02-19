import { Request, Response } from 'express'
import { APIResponse } from '../types/APIResponse'
import { addRoom, roomDelete } from '../models/room';
import { Rooms } from '../types/Rooms';

export const roomController = async (req: Request<{}, {}, Rooms & { username: string }>, res: Response<APIResponse>) => {
    const { name, isPrivate, username } = req.body;
    const avatar = req.file ? req.file.filename : 'user.png';
    try {
        if (!username) throw new Error("Server Error");
        const { cookie, _id, totalMembers } = await addRoom({ name, avatar, createBy: username, isPrivate }, req.cookies['rooms'])
        res.cookie('rooms', cookie)
        res.json({
            statusCode: 200,
            message: 'Room Created Successfully',
            data: [
                {
                    name,
                    avatar: `/rooms/${avatar}`,
                    _id,
                    totalMembers
                }
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
export const roomDeleteController = async (req: Request<{}, {}, { roomId: string, username: string }>, res: Response<APIResponse>) => {
    const { roomId, username } = req.body;
    try {
        const roomsToken = await roomDelete(username, roomId, req.cookies['rooms'])
        res.cookie('rooms', roomsToken)
        res.json({
            statusCode: 200,
            message: 'Room Deleted Successfully'
        })
    } catch (error) {
        console.log('Error at roomController : ', error);
        res.json({
            statusCode: 400,
            message: 'Server Error'
        })
    }
}