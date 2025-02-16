import { Request, Response } from 'express'
import { APIResponse } from '../../types/APIResponse'
import { cookieValidator } from '../../lib/cookie'

export const userDataFromAuth = async (req: Request<{}, {}, { token: string }>, res: Response<APIResponse>) => {
    const token = req.cookies['auth']
    if (token) {
        const user = cookieValidator(token)
        res.json({
            statusCode: 200,
            message: 'User data',
            data: {
                user
            }
        })
    }
}
