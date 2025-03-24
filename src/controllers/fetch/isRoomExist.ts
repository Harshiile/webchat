import { Request, Response } from 'express'
import { isRoomExists } from "../../models/room";
import { APIResponse } from '../../types/APIResponse';
import mongoose from 'mongoose';

export const IsRoomExistController = async (req: Request<{}, {}, { roomId: string }>, res: Response<APIResponse>) => {
    if (mongoose.isValidObjectId(req.body.roomId)) {
        res.json({
            statusCode: 200,
            message: 'Is room exists?',
            data: [
                {
                    "isRoomExist": await isRoomExists(new mongoose.Types.ObjectId(req.body.roomId))
                }
            ]
        })
    }
    else res.json({
        statusCode: 400,
        message: 'Room Link is not valid'
    })
}