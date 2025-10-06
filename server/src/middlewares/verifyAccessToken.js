import {ApiError, asyncHandler} from '../utility/index.js';
import statusCode from '../constants/statusCode.js';
import {User} from '../models/index.js';
import jwt from 'jsonwebtoken';
import cookieOptions from "../constants/cookieOptions.js";

const verifyAccessToken = async (req, res, next) => {

    try {

        const accessToken = req?.cookies?.accessToken;

        if (!accessToken || accessToken === 'null') {
            throw new ApiError(statusCode.UNAUTHORIZED, 'Access token is missing!');
        }


        const verifiedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );


        if (!verifiedToken) {
            throw new ApiError(
                statusCode.UNAUTHORIZED,
                'Access token validation error!'
            );
        }

        // Todo: Is there need to get the user document manually here?
        const user = User.findById(verifiedToken?.userId).select('-password -__v');

        if (!user) {
            throw new ApiError(statusCode.UNAUTHORIZED, 'No such user found!');
        }

        req.userId = verifiedToken?.userId;

        next();

    }

    catch (error) {

        // If access token is expired, check for refresh token and regenerate the access token

        if (error.message.includes('jwt expired')) {

            try {

                // Generate a new access token using the refresh token

                const refreshToken = req?.cookies?.refreshToken;

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

                req.userId = verifiedRefreshToken?.userId;
                res.cookie('accessToken', newAccessToken, cookieOptions);

                return next();



            } catch (err) {

                if (err?.message.includes('jwt expired')) {
                    return next(new ApiError(statusCode.UNAUTHORIZED, 'Refresh token is expired! Kindly Login!'));
                }

                next(new ApiError(statusCode.UNAUTHORIZED, err?.message));

            }

        }

        next(new ApiError(statusCode.UNAUTHORIZED, error.message, [], error?.stack));

    }

};

export {verifyAccessToken};
