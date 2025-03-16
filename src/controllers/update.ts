import { Request, Response } from 'express'
import { APIResponse } from '../types/APIResponse'
import { updateUser } from '../models/schema'
import fs from 'fs'
import path from 'path'
import { cookieGenerator, cookieValidator } from '../lib/cookie'

interface UpdateUser {
    username: string,
    avatar: string,
    name: string,
    oldavatar: string
}

const deleteOldAvatar = (oldavatar: string) => {
    const oldAvatarPath = path.join(__dirname, `../../client/public${oldavatar}`);
    fs.rmSync(oldAvatarPath)
}

export const updateUserInDB = async (req: Request<{}, {}, UpdateUser>, res: Response<APIResponse>) => {
    const token = req.cookies['auth']
    let oldavatar, oldUsername;
    if (token) {
        const user = cookieValidator(token)
        if (typeof user != 'string') {
            oldavatar = user.avatar;
            oldUsername = user.username
        }
    }
    const { username: newUsername, name } = req.body
    if (req.file && oldavatar != '/uploads/user.png') {
        deleteOldAvatar(oldavatar)
    }
    try {
        const avatar = `/uploads/${req.file?.filename || ''}`
        await updateUser(oldUsername, newUsername, avatar, name)
        const loginCookie = cookieGenerator({ username: newUsername, name, avatar })
        res.cookie('auth', loginCookie, {
            httpOnly: true
        })
        res.json({
            statusCode: 200,
            message: 'User Updated'
        })
    } catch (error) {
        res.json({
            statusCode: 401,
            message: 'Server error'
        })
    }
}