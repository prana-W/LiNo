import verifyAccessToken from "./middlewares/verifyAccessToken.middleware.js";

function registerSockets(io) {


    // Middleware to verify access token for each socket connection
    io.use(verifyAccessToken);

    io.on('connection', (socket) => {

        // Check the accessToken from auth and verify
        // If not verified, disconnect the socket and return auth failed
        // Client hits /refresh to generate a new accessToken and tries to reconnect. (if refresh token is not valid, user then logs back in)
        // After all the verification, we use the payload in the jwt (username) to create a room with the username.
        // Emit the frequent payloads of data in the DB and after confirmation, to all the users in that room except us
        // After successfully saved in DB, emit a confirmation to the payload sender client, which is used to delete the cached string

        console.log('A user connected:', socket.id);
        console.log(socket?.username);

        socket.join(socket?.username);

        socket.on('subtitle', (payload) => {
            console.log(payload);


            socket.emit('confirmation', {message: socket.handshake})

            io.to("userId").emit(payload)

        })


    });
}

export default registerSockets;