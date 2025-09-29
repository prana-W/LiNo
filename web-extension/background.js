import {io} from './lib/socket.io.esm.min.js';
import {SERVER_URL} from './constants.js';

const socket = io(SERVER_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 2000,
    auth: {
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGQ5YWZkOTgyZjFjNjk2YjVjYTQ2ZDgiLCJ1c2VybmFtZSI6InRlc3Q2IiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tNiIsImlhdCI6MTc1OTE1NTgzNCwiZXhwIjoxNzU5NzYwNjM0fQ.rmRmbNRJ3DSzWqmURVEhYeJC07feW3ajPt815VqfJ_U",
    }
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
