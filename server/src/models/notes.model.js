import mongoose from 'mongoose';

const notesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: 'New Notes',
        },
        videoUrl: {
            type: String,
            required: true,
            index: true,
        },
        description: {
            type: String,
            default: '',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        collection: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Collection',
            // default: 'Recently-Added', // add the notesId for "Recently Added" collection by default
        },
        isFavourite: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Notes = mongoose.model('Notes', notesSchema);

export default Notes;

