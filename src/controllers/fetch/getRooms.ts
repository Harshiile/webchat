import { Request, Response } from 'express'
import { cookieGenerator, cookieValidator } from "../../lib/cookie"
import { APIResponse } from '../../types/APIResponse'
import { getRoomsFromDB } from '../../models/schema'

export const getRooms = async (req: Request, res: Response<APIResponse>) => {
    const roomsToken = req.cookies['rooms']
    if (roomsToken) {
        res.json({
            statusCode: 200,
            message: 'Fetching room successful',
            data: [
                cookieValidator(roomsToken)
            ]
        })
    }
    else {
        // fetch rooms from user table by username
        const user = cookieValidator(req.cookies['auth'])
        let roomsDetails;
        if (typeof (user) != 'string') {
            roomsDetails = await getRoomsFromDB(user.username)
            res.cookie('rooms', cookieGenerator({ roomsDetails }))
        }
        res.json({
            statusCode: 200,
            message: 'Fetching room from DB successful',
            data: [
                {
                    roomsDetails
                }
            ]
        })
    }

}