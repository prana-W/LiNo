import {ApiError, ApiResponse, asyncHandler} from '../utility/index.js';
import {User} from '../models/index.js';
import statusCode from '../constants/statusCode.js';
import cookieOptions from '../constants/cookieOptions.js';

const signupUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req?.body;

    if (!username || !email || !password) {
        throw new ApiError(statusCode.BAD_REQUEST, 'All fields are required!');
    }

    // make access and refresh token, save the refresh token in the db and send both tokens in cookie and other method for app to access it

    const existingUser = await User.findOne({
        $or: [{email}, {username}],
    });

    if (existingUser) {
        throw new ApiError(
            statusCode.CONFLICT,
            'User already exists. Try different email or username.'
        );
    }

    const user = await User.create({
        email: email,
        username: username,
        password: password,
    });

    const refreshToken = await user.generateAndUpdateRefreshToken(user?._id);
    const accessToken =
        await user.generateAccessTokenFromRefreshToken(refreshToken);

    if (!refreshToken || !accessToken) {
        throw new ApiError(
            400,
            'Something went wrong while generating tokens.'
        );
    }

    return res
        .status(statusCode.OK)
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(
            new ApiResponse(statusCode.OK, 'User created successfully.', {
                username: user?.username,
                accessToken,
                refreshToken,
            })
        );
});

export {signupUser};
