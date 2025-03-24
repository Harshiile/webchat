import { Request, Response } from 'express'
import { cookieGenerator, cookieValidator } from "../../lib/cookie"
import { APIResponse } from '../../types/APIResponse'
import mongoose, { mongo } from 'mongoose'
import { getMembers } from '../../models/room'

export const getMemberController = async (req: Request<{}, {}, { roomId: mongoose.Types.ObjectId }>, res: Response<APIResponse>) => {
    const data = await getMembers(req.body.roomId)
    res.json({
        statusCode: 200,
        message: 'Members of room',
        data: [
            { members: data }
        ]
    })
}