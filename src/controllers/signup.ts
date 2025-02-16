import { Request, Response } from 'express'
import { APIResponse } from '../types/APIResponse'
import { UserAuth } from '../types/UserAuth';
import { getUserByEmail, userAdd } from '../models/schema';


export const signUpController = async (req: Request<{}, {}, UserAuth>, res: Response<APIResponse>) => {
    const { email, password, username, name }: UserAuth = req.body;
    const avatar = req.file ? req.file.filename : 'user.png';

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
            res.json({
                statusCode: 200,
                message: 'Signup Successfully'
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