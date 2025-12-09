import dotenv from 'dotenv';
import {createServer} from 'http';
import {
    connectToDatabase,
    connectToNgrok,
    connectToRedis,
} from './connection/index.js';
import app from './app.js';
import initializeSocket from './sockets/index.js';
import registerSockets from './sockets/socket.js';
import ngrok from '@ngrok/ngrok';

dotenv.config({
    path: `./.env`,
});

const port = process.env.PORT || 8000;
const httpServer = createServer(app); // Create HTTP server

const io = initializeSocket(httpServer); // Initialize Socket.io with the HTTP server
registerSockets(io);

connectToDatabase().then(() => {
    httpServer.listen(port, () => {
        console.log(`✅ Server is running on port ${port}`);
    });
});

connectToRedis().then(() => {
    console.log(`✅ Redis connected: ${process.env.REDIS_URL}`);
});

// connectToNgrok(port).then((listener) => {
//     console.log('Public Server URL:', listener.url());
// });
