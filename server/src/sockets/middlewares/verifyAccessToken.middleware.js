import jwt from 'jsonwebtoken';
import {ApiError} from "../../utility/index.js";
import statusCode from "../../constants/statusCode.js";
import {User} from "../../models/index.js";

// Check for accessToken in the socket auth object and verify it
const verifyAccessToken = () => {

    return async (socket, next) => {
        try {
            const accessToken = socket.handshake.auth?.accessToken;

            if (!accessToken) {
                const err = new Error('Access token is missing!');
                err.data = {
                    content:
                        'Please provide a access token to connect with the server',
                };
                throw err;
            }

            const verifiedToken = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET
            );

            if (!verifiedToken) {
                throw new Error('Access token verification failed!');
            }

            socket.userId = verifiedToken?.userId;
            next();

        } catch (error) {
            if (error.message.includes('jwt expired')) {

                console.log('Access Token is expired!')

                try {

                    // Generate a new access token using the refresh token

                    const refreshToken = socket.handshake.auth?.refreshToken;

                    if (!refreshToken || refreshToken === 'undefined') {
                        throw new ApiError(statusCode.UNAUTHORIZED, 'Refresh token is missing!');
                    }

                    const verifiedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

                    if (!verifiedRefreshToken) {
                        throw new ApiError(statusCode.UNAUTHORIZED, 'Refresh token is not verified. Please Login!');
                    }

                    const user = await User.findById(verifiedRefreshToken?.userId).select('-password -__v');

                    if (!user) {
                        throw new ApiError(statusCode.UNAUTHORIZED, 'Error in fetching user! Kindly Login again!');
                    }

                    const newAccessToken = await user.generateAccessTokenFromRefreshToken(refreshToken);

                    socket.userId = verifiedRefreshToken?.userId;
                    chrome.storage.local.set({accessToken: newAccessToken});


                    return next();



                } catch (err) {

                    if (err?.message.includes('jwt expired')) {
                        return next(new ApiError(statusCode.UNAUTHORIZED, 'Refresh token is expired! Kindly Login!'));
                    }

                    return next(new ApiError(statusCode.UNAUTHORIZED, err?.message));

                }

            }

            next(new ApiError(statusCode.UNAUTHORIZED, error.message, [], error?.stack));

        }

        }
};

export default verifyAccessToken;
