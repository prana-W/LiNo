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
        content: {
            type: String,
            default: '',
        },
        summarised_content: {
            type: String,
            default: '',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        playlist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Playlist',
            // default: 'Recently-Added', // add the notesId for "Recently Added" playlist by default
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

