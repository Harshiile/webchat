import { CookieOptions, Request, Response } from 'express'
import { APIResponse } from '../../types/APIResponse'
import { userModel } from '../../models/schema'
import { UserAuth } from '../../types/UserAuth';
import { cookieGenerator } from '../../lib/cookie';

interface LoginData {
    email: string,
    password: string,
}

export const loginController = async (req: Request<{}, {}, LoginData>, res: Response<APIResponse>) => {
    const { email, password } = req.body;
    const [user]: UserAuth[] = await userModel.find({ email });
    if (user) {
        if (user.password == password) {
            const { name, avatar } = user
            const loginCookie = cookieGenerator({ name, avatar })
            res.cookie('auth', loginCookie, {
                httpOnly: true
            })
            res.json({
                statusCode: 200,
                message: 'Login Successfully',
                rediectUrl: '/profile'
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