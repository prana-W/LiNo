import {ApiError, ApiResponse, asyncHandler} from "../../utility/index.js";

const uploadScreenshot = asyncHandler(async (req, res) => {

    if (!req.file) {
        return res.status(400).json(new ApiError(400, "No file uploaded"));
    }

    // Todo: Store the file name in the database associated with the user

    return res.status(200).json(new ApiResponse(200, "File uploaded successfully", {
        file: {
            originalName: req.file.originalname,
            fileName: req.file.filename,
            path: req.file.path,
            size: req.file.size,
        },
    }))

})

export {uploadScreenshot};