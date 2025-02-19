export interface UserAuth {
    email: string,
    password: string,
    name: string,
    avatar: string,
    username: string,
    rooms?: Array<Object>
}