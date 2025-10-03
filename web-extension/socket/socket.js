import {SERVER_URL} from "../constants.js";
import {io} from '../lib/socket.io.esm.min.js';

const socketClientOptions = {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 2000,
    autoConnect: false,
    auth: {
        accessToken: "",
        refreshToken: ""
    }
}

const socket = io(SERVER_URL, socketClientOptions);

const connectToSocket = () => {

    if (!socket.isConnected) {
        console.log('Connecting to LiNo server...');
        chrome.storage.local.get(["accessToken", "refreshToken"], (result) => {
            if (result) {
                socket.auth.accessToken = result.accessToken;
                socket.auth.refreshToken = result.refreshToken;
            }
        });
        socket.connect();
    }
}

const disconnectFromSocket = () => {
    if (socket.connected) {
        console.log('Disconnecting from LiNo server...');
        socket.auth.accessToken = null;
        socket.auth.refreshToken = null;
        socket.disconnect();
    }
}

socket.on("connect", () => {
    console.log('Connected to LiNo server!', socket.id);
});

socket.on("connect_error", (error) => {
    console.error('Connection error:', error);
});

socket.on("disconnect", (reason) => {
    console.log('Disconnected from LiNo server:', reason);
});

export {socket, connectToSocket, disconnectFromSocket};