import {verifyAccessToken} from '../middleware/auth.js';
import Lecture from '../models/lecture.model.js';

function registerSockets(io) {
    // Middleware to verify access token for each socket connection
    io.use(verifyAccessToken);

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        console.log(socket?.username);

        socket.join(socket?.username);

        socket.on('packet', async (payload) => {
            try {
                const {caption, timestamps, videoUrl} = payload;

                await Lecture.create();

                console.log(payload);

                socket.emit('confirmation', {message: socket.handshake});
            } catch (error) {}
        });
    });
}
export default registerSockets;