import verifyAccessToken from './middlewares/verifyAccessToken.middleware.js';
import handlePacket from './controllers/handlePacket.controller.js';
import {socket} from "../../../web-extension/socket/socket.js";

function registerSockets(io) {
    // Middleware to verify access token for each socket connection
    io.use(verifyAccessToken());

    io.on('connection', (socket) => {
        console.log('✅ Socket connected:', socket.id);
        // socket.join(socket?.userId);
        // Todo: Only emit to the room of the user

        socket.on('packet', handlePacket(socket));

        socket.on('disconnect', () => {
            // Todo: Handle socket disconnection
            console.log('Socket disconnected. User:', socket?.userId);
        });
    });
}

export default registerSockets;
