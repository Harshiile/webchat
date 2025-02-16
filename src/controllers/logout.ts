import { Request, Response } from 'express'
import { APIResponse } from '../types/APIResponse'
export const logoutUser = async (req: Request, res: Response<APIResponse>) => {
    const cookie = req.cookies['auth']
    if (cookie) {
        res.clearCookie('auth')
    }
    res.json({
        statusCode: 200,
        message: 'Logout successful',
        redirectUrl: '/login'
    })
}