import {ApiError, ApiResponse, asyncHandler} from '../utility/index.js';
import {Notes} from '../models/index.js';
import statusCode from '../constants/statusCode.js';
import NotesContent from "../models/notesContent.model.js";
import timeStampToSeconds from '../utility/timeStampToSeconds.util.js';
import mongoose from "mongoose";

const getAllNotes = asyncHandler(async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        throw new ApiError(
            401,
            'Unauthorized access. No userId found in request.'
        );
    }

    // Pipeline, fetch all notes of the user
    // Only add the necessary details of it - name, description, createdAt, updatedAt, videoUrl, isFavourite, collection
    // Sort using updatedAt
    // Populate collection name and id
    // Cache everything in Redis temporarily for faster loading speed/fetch
    // Add a worker to manually flush/clean all these Redis cache once in 24 hours
    // Also invalidate and flush the cache when a new notes is added/deleted/updated

    const allNotes = await Notes.find({user: userId})
        .select('-content -summarised_content -__v')
        .sort({updatedAt: -1});

    return res.json(
        new ApiResponse(200, 'All notes fetched successfully.', {
            notes: allNotes,
        })
    );
});

const getParticularNotes = asyncHandler(async (req, res) => {
    const notesId = req.params?.notesId;

    if (!notesId) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Notes ID not found!');
    }

    const notes = await Notes.findById(notesId);

    // Only allow notes access, if user is the owner of the notes, else not!
    if (String(notes?.user) !== req?.userId) {
        throw new ApiError(
            statusCode.UNAUTHORIZED,
            'Unauthorized access. You are not allowed to access this notes.'
        );
    }

    if (!notes) {
        throw new ApiError(statusCode.NOT_FOUND, 'Notes not found!');
    }

    return res
        .status(statusCode.OK)
        .json(
            new ApiResponse(
                statusCode.OK,
                'Notes fetched successfully!',
                notes
            )
        );
});

const addTextContent = asyncHandler(async (req, res) => {

    // Todo: Pass timeStamp as a string
    const {name, videoUrl, description, content, timeStamp} = req.body;

    let notes;

    if (!req?.isExistingNotes) {
        notes = await Notes.create({
            name,
            videoUrl,
            description,
            user: req.userId
        });
    }
    else {
        notes = await Notes.findById(req?.notesId);
    }

        if (!notes) {
            throw new ApiError(statusCode.NOT_FOUND, 'Notes not found!');
        }

        if (!videoUrl) throw new ApiError(statusCode.NOT_FOUND, 'Video URL not found!');

        // Add a new text content to existing notes
        await NotesContent.create({
            notesId: notes._id,
            type: 'text',
            value: content,
            timestamp: timeStampToSeconds(timeStamp),
        })

    return res.status(statusCode.OK).json(new ApiResponse(200, 'Notes was added!'));

});

const addScreenshot = asyncHandler(async (req, res) => {
    const {name, videoUrl, description, timeStamp} = req.body;

    let notes;

    if (!req?.isExistingNotes) {
        notes = await Notes.create({
            name,
            videoUrl,
            description,
            user: req.userId
        });
    }
    else {
        notes = await Notes.findById(req?.notesId);
    }

    if (!notes) {
        throw new ApiError(statusCode.NOT_FOUND, 'Notes not found!');
    }

    if (!videoUrl) throw new ApiError(statusCode.NOT_FOUND, 'Video URL not found!');

    if (!req.file) {
        return res.status(400).json(new ApiError(400, "No screenshot was uploaded!"));
    }

    await NotesContent.create({
        notesId: notes._id,
        type: 'image',
        value: req.file.path,
        timestamp: timeStampToSeconds(timeStamp),
    })

    return res.status(200).json(new ApiResponse(200, "Screenshot added successfully", {
        file: {
            originalName: req.file.originalname,
            fileName: req.file.filename,
            size: req.file.size,
        },
    }));

});

const allNotesContent = asyncHandler(async (req, res) => {
    const { notesId } = req.params;

    if (!notesId) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            "Notes ID not found!"
        );
    }

    if (!mongoose.Types.ObjectId.isValid(notesId)) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            "Invalid Notes ID"
        );
    }

    const notesContent = await NotesContent.find({ notesId })
        .sort({ timestamp: 1, order: 1 }) // primary: timestamp, fallback: order
        .lean();

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            "Notes content fetched successfully",
            notesContent
        )
    );
});

export {getAllNotes, getParticularNotes, addTextContent, addScreenshot, allNotesContent};
