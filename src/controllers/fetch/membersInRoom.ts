import { Request, Response } from 'express'
import { totalMembersInRoom } from '../../models/room'
import { APIResponse } from '../../types/APIResponse';

export const membersInRooms = async (req: Request<{}, {}, { roomId: string }>, res: Response<APIResponse>) => {
    res.json({
        statusCode: 200,
        message: 'Total members in Rooms',
        data: {
            totalMembers: await totalMembersInRoom(req.body.roomId)
        }
    })
}
