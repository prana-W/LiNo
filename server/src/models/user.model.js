import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {ApiError} from '../utility/index.js';
import statusCode from '../constants/statusCode.js';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            unique: true,
            required: true,
        },
        refreshToken: {
            type: String,
            default: null,
        },
        otp: {
            type: String
        },
        otpExpiry: {
            type: Date
        }
    },
    {timestamps: true}
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);

    next();
});

userSchema.methods.generateAndUpdateRefreshToken = async function (userId) {
    try {
        const refreshToken = jwt.sign(
            {userId},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
        );

        const user = await User.findByIdAndUpdate(
            userId,
            {refreshToken},
            {new: true}
        );

        if (!user) {
            throw new ApiError(
                statusCode.BAD_REQUEST,
                'User not found while creating refreshToken'
            );
        }

        return refreshToken;
    } catch (error) {
        throw error;
    }
};

userSchema.methods.generateAccessTokenFromRefreshToken = async (
    refreshToken
) => {
    try {
        const verifiedRefreshToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        if (!verifiedRefreshToken) {
            throw new ApiError(
                statusCode.BAD_REQUEST,
                'Error in Refresh Token verification'
            );
        }

        const user = await User.findById(verifiedRefreshToken?.userId).select(
            '-password -refreshToken -__v'
        );
        if (!user) {
            throw new ApiError(
                statusCode.BAD_REQUEST,
                'User not found while creating refreshToken'
            );
        }

        const payload = {
            userId: user?._id,
            username: user?.username,
            email: user?.email,
        };

        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });
    } catch (error) {
        throw error;
    }
};

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateOtp = async function () {
    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiry to 10 minutes from now
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    this.otp = otp;
    this.otpExpiry = otpExpiry;

    await this.save();

    return {
        success: true,
        otpExpiry,
    };
};

userSchema.methods.verifyOtp = async function (enteredOtp) {
    if (!this.otp || !this.otpExpiry) {
        return false;
    }

    // Check expiry
    if (this.otpExpiry < new Date()) {
        return false;
    }

    // Compare OTP
    const isValid = this.otp === enteredOtp;

    // Optional but recommended: clear OTP after successful verification
    if (isValid) {
        this.otp = null;
        this.otpExpiry = null;
        await this.save();
    }

    return isValid;
};

const User = mongoose.model('User', userSchema);

export default User;
