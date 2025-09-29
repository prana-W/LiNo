import {ApiError, asyncHandler} from "../utility/index.js";
import statusCode from "../constants/statusCode.js";
import {User} from "../models/index.js";
import jwt from "jsonwebtoken";

const verifyAccessToken = asyncHandler (async(req, res, next) => {
    const accessToken = req?.cookies?.accessToken;

    if (!accessToken) {
        throw new ApiError(statusCode.UNAUTHORIZED, 'Access token is missing!');
    }

    const verifiedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if (!verifiedToken) {
        throw new ApiError(statusCode.UNAUTHORIZED, 'Access token validation error!');

    }

    const user = User.findById(verifiedToken?.userId).select('-password -__v');

    if (!user) {
        throw new ApiError(statusCode.UNAUTHORIZED, 'No such user found!');
    }

    req.user = user;

    next();

})

export {verifyAccessToken}