import { Request, Response, NextFunction } from 'express'
import { cookieValidator } from '../lib/cookie';

export const getUsername = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['auth']
    if (token) {
        const user = cookieValidator(token);
        req.body.username = typeof (user) != 'string' ? user.username : null
    }
    next();
}