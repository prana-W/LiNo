import {io} from './lib/socket.io.esm.min.js';

const socket = io('http://localhost:8000', {
    transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
    reconnection: true,
    reconnectionDelay: 1000,
});

socket.on("connect", () => {
    console.log('Connected to server!', socket.id);
});

socket.on("connect_error", (error) => {
    console.error('Connection error:', error);
});

socket.on("disconnect", (reason) => {
    console.log('Disconnected:', reason);
});