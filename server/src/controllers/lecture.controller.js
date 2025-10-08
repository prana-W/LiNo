import {ApiError, ApiResponse, asyncHandler} from '../utility/index.js';
import {Lecture} from '../models/index.js';
import statusCode from '../constants/statusCode.js';

const getAllLectures = asyncHandler(async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        throw new ApiError(
            401,
            'Unauthorized access. No userId found in request.'
        );
    }

    // Pipeline, fetch all lectures of the user
    // Only add the necessary details of it - name, description, createdAt, updatedAt, videoUrl, isFavourite, playlist
    // Sort using updatedAt
    // Populate playlist name and id
    // Cache everything in Redis temporarily for faster loading speed/fetch
    // Add a worker to manually flush/clean all these Redis cache once in 24 hours
    // Also invalidate and flush the cache when a new lecture is added/deleted/updated

    const allLectures = await Lecture.find({user: userId})
        .select('-content -summarised_content -__v')
        .sort({updatedAt: -1});

    return res.json(
        new ApiResponse(200, 'All lectures fetched successfully.', {
            lectures: allLectures,
        })
    );
});

const getParticularLecture = asyncHandler(async (req, res) => {
    const lectureId = req.params?.lectureId;

    if (!lectureId) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Lecture ID not found!');
    }

    const lecture = await Lecture.findById(lectureId);

    // Only allow lecture access, if user is the owner of the lecture, else not!
    if (String(lecture?.user) !== req?.userId) {
        throw new ApiError(
            statusCode.UNAUTHORIZED,
            'Unauthorized access. You are not allowed to access this lecture.'
        );
    }

    if (!lecture) {
        throw new ApiError(statusCode.NOT_FOUND, 'Lecture not found!');
    }

    return res
        .status(statusCode.OK)
        .json(
            new ApiResponse(
                statusCode.OK,
                'Lecture fetched successfully!',
                lecture
            )
        );
});

export {getAllLectures, getParticularLecture};
