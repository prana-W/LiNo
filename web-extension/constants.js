export const SERVER_URL='http://localhost:8000';
export const socketClientOptions = {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 2000,
    autoConnect: false,
    auth: {
        accessToken: "",
        refreshToken: ""
    }
}