export interface Message {
    uuid: string,
    user: string,
    date: string,
    message: string
}

export interface ChatRoom {
    name: string,
    unreadMessages: number
    type: string
}