import { Request, Response } from 'express'
import { APIResponse } from '../../types/APIResponse'
import { userModel } from '../../models/schema'

interface Username {
    username: string
}

export const usernameCheck = async (req: Request<{}, {}, Username>, res: Response<APIResponse>) => {
    const { username }: Username = req.body
    try {
        const [usernameExist] = await userModel.find({ username })
        if (!usernameExist) {
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
            statusCode: 401,
            message: 'Server error'
        })
    }
}