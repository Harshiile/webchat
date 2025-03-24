import { JwtPayload, sign, verify } from 'jsonwebtoken'

export const cookieGenerator = (payload: Object): string => {
    return process.env.JWT_SECRET ? sign(payload, process.env.JWT_SECRET) : ""
}
export const cookieValidator = (token: string): JwtPayload | string => {
    return process.env.JWT_SECRET ? verify(token, process.env.JWT_SECRET) : ""
}