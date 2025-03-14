import { Request, Response } from 'express'
import { APIResponse } from '../types/APIResponse'
import { UserAuth } from '../types/UserAuth';
import { getUserByEmail, userAdd } from '../models/schema';
import { cookieGenerator } from '../lib/cookie';


export const signUpController = async (req: Request<{}, {}, UserAuth>, res: Response<APIResponse>) => {
    const { email, password, username, name }: UserAuth = req.body;
    const avatar = `/uploads/${req.file ? req.file.filename : 'user.png'}`;

    const user: UserAuth = await getUserByEmail(email)
    if (!user) {


        try {
            await userAdd({
                email,
                password,
                username,
                avatar,
                name
            })
            const loginCookie = cookieGenerator({ username, name, avatar })
            console.log(loginCookie);
            res.cookie('auth', loginCookie)
            res.json({
                statusCode: 200,
                message: 'Signup Successfully',
                redirectUrl: '/profile'
            })
        } catch (error) {
            res.json({
                statusCode: 401,
                message: 'Server error'
            })
        }
    }
    else
        res.json({
            statusCode: 401,
            message: 'User already exists'
        })
}
export const oAuthGoogleController = async (req: Request<{}, {}, { data: UserAuth }>, res: Response<APIResponse>) => {
    const { email, password, username, name, avatar } = req.body.data;
    const user: UserAuth = await getUserByEmail(email)
    if (!user) {
        try {
            await userAdd({
                email,
                password,
                username,
                avatar,
                name
            })
            const loginCookie = cookieGenerator({ username, name, avatar })
            res.cookie('auth', loginCookie)
            res.json({
                statusCode: 200,
                message: 'Signup Successfully',
                redirectUrl: '/profile'
            })
        } catch (error) {
            res.json({
                statusCode: 401,
                message: 'Server error'
            })
        }
    }
    else {
        const loginCookie = cookieGenerator({ username: user.username, name: user.name, avatar: user.avatar })
        res.cookie('auth', loginCookie)
        res.json({
            statusCode: 200,
            message: 'Login Successfully',
            redirectUrl: '/profile'
        })
    }
}