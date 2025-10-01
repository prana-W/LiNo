import jwt from 'jsonwebtoken';

// Check for accessToken in the socket auth object and verify it
const verifyAccessToken = (socket, next) => {
    try {
        const accessToken = socket.handshake.auth?.accessToken;

        if (!accessToken) {
            const err = new Error('Access token is missing!');
            err.data = {
                content:
                    'Please provide a access token to connect with the server',
            };
            next(err);
        }

        const verifiedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        if (!verifiedToken || !verifiedToken?.username) {
            const err = new Error('Access token verification failed!');
            next(err);
        }

        // Add username to the socket instance for future use
        socket.userId = verifiedToken?.userId;

        next();
    } catch (err) {
        next(err);
    }
};

export default verifyAccessToken;
