import { Request, Response } from 'express'
import { APIResponse } from '../../types/APIResponse'
import { userModel } from '../../models/schema'
import { UserAuth } from '../../types/UserAuth';


export const signUpController = async (req: Request<{}, {}, UserAuth>, res: Response<APIResponse>) => {
    const { email, password, username, name }: UserAuth = req.body;
    const avatar = req.file ? req.file.filename : 'user.png';

    const [user]: UserAuth[] = await userModel.find({ email });
    if (!user) {
        try {
            await userModel.create({
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