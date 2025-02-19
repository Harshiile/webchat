import { Request, Response } from 'express'
import { APIResponse } from '../types/APIResponse'
import { cookieGenerator } from '../lib/cookie';
import { getUserByEmail } from '../models/schema';
import { UserAuth } from '../types/UserAuth';
import { AuthCookie } from '../types/AuthCookie';

interface LoginData {
    email: string,
    password: string,
}

export const loginController = async (req: Request<{}, {}, LoginData>, res: Response<APIResponse>) => {
    const { email, password } = req.body;
    const user: UserAuth = await getUserByEmail(email)
    if (user) {
        if (user.password == password) {
            const { name, avatar, username }: AuthCookie = user
            const loginCookie = cookieGenerator({ username, name, avatar })
            res.cookie('auth', loginCookie)
            res.json({
                statusCode: 200,
                message: 'Login Successfully',
                redirectUrl: '/profile'
            })
        }
        else
            res.json({
                statusCode: 401,
                message: 'Password Incorrect'
            })
    }
    else
        res.json({
            statusCode: 401,
            message: 'User not found'
        })
}