import {ApiError, asyncHandler} from "./index.js";
import jwt from "jsonwebtoken";
import {User} from "../models/index.js";
import statusCode from "../constants/statusCode.js";

const generateAndUpdateRefreshToken = async (userId) => {

    try {
        const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY});

        const user = await User.findByIdAndUpdate(userId, {refreshToken}, {new: true});

        if (!user) {
            throw new ApiError(statusCode.BAD_REQUEST, "User not found while creating refreshToken");
        }

        return refreshToken;
    }

    catch (error) {
        throw error;
    }

};

const generateAccessTokenFromRefreshToken = async (refreshToken) => {

    try {
        const verifiedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        if (!verifiedRefreshToken) {
            throw new ApiError(statusCode.BAD_REQUEST, "Error in Refresh Token verification");
        }

        const user = await User.findById(verifiedRefreshToken?.userId).select("-password -refreshToken -__v");
        if (!user) {
            throw new ApiError(statusCode.BAD_REQUEST, "User not found while creating refreshToken");
        }

        const payload = {
            userId: user?._id,
            username: user?.username,
            email: user?.email
        }

        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY});
    }

    catch (error) {
    throw error;
    }


};

export {generateAccessTokenFromRefreshToken, generateAndUpdateRefreshToken};