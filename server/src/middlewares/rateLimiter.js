import rateLimiter from 'express-rate-limit'
import {ApiResponse} from "../utility/index.js";

const authRateLimiter = () => rateLimiter({
    max: 20, // limit each IP to 20 requests per 5 minutes
    windowMs:  1000*60*5,
    message: new ApiResponse(
        429,
        "Too many requests! Try again after 5 minutes."
    ),
    standardHeaders: true,
})

export {authRateLimiter}