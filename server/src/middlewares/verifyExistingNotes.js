import asyncHandler from '../utility/asyncHandler.js';
import {Notes} from '../models/index.js';
import ApiError from '../utility/apiError.js';
import statusCode from '../constants/statusCode.js';

const verifyExistingNotes = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const {videoUrl} = req.body;

    if (!userId) {
        throw new ApiError(
            statusCode.UNAUTHORIZED,
            'Unauthorized access. No userId found in request.'
        );
    }

    if (!videoUrl) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            'Bad Request. No videoUrl found in request body.'
        );
    }

    const existingNotes = await Notes.findOne({user: userId, videoUrl: videoUrl});

    if (existingNotes) {
        req.isExistingNotes = true;
        req.notesId = existingNotes._id;
    } else {
        req.isExistingNotes = false;
    }

    next();
});

export default verifyExistingNotes;