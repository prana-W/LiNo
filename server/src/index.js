import dotenv from 'dotenv';
dotenv.config({
    path: `./.env`,
});
import {createServer} from 'http';
import connectToDatabase from './connection/index.js';
import app from './app.js';
import initializeSocket from "./socket.js";
import registerSockets from "./sockets/index.js";

const port = process.env.PORT || 8000;
const httpServer = createServer(app); // Create HTTP server

const io = initializeSocket(httpServer); // Initialize Socket.io with the HTTP server
registerSockets(io);

connectToDatabase()
    .then(() => {
        httpServer.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('There was an error connecting to the database', err);
    });