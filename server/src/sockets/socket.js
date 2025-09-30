import verifyAccessToken from './middlewares/verifyAccessToken.middleware.js';
import handlePacket from "./controllers/handlePacket.controller.js";


function registerSockets(io) {
    // Middleware to verify access token for each socket connection
    io.use(verifyAccessToken);

    io.on('connection', (socket) => {

        console.log('✅ Socket connected: ', socket.id);
        socket.join(socket?.username);

        socket.on('packet', handlePacket(socket));
    });

}

export default registerSockets;
