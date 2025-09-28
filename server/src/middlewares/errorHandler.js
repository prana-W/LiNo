import {ApiResponse} from "../utility/index.js";

const errorHandler = (err, req, res ) => {

    const errorObj = new ApiResponse(err.statusCode || 500, err.message || "Internal Server Error");

    console.error(errorObj);
    return res.status(err.statusCode || 500).json(errorObj);
}

export default errorHandler;