export interface Rooms {
    name: string,
    avatar: string,
    isPrivate: boolean,
    createBy: string,
    members?: string[]
}