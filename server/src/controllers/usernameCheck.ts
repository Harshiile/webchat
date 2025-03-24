import { Request, Response } from 'express'
import { APIResponse } from '../types/APIResponse'
import { getUserByUsername } from '../models/schema'
import { UserAuth } from '../types/UserAuth'

interface Username {
    username: string
}

export const usernameCheck = async (req: Request<{}, {}, Username>, res: Response<APIResponse>) => {
    const { username }: Username = req.body
    try {
        const user: UserAuth = await getUserByUsername(username)
        if (!user) {
            res.json({
                statusCode: 200,
                message: 'Successfully Username Created'
            })
        }
        else {
            res.json({
                statusCode: 401,
                message: 'Username already taken'
            })
        }
    } catch (error) {
        res.json({
            statusCode: 500,
            message: 'Server error'
        })
    }
}