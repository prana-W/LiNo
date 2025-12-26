import mongoose from "mongoose";

const notesContentSchema = new mongoose.Schema({
    notesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notes",
        required: true,
        index: true,
    },

    type: {
        type: String,
        enum: ["text", "image"],
        required: true,
    },

    value: {
        type: String,
        required: true,
    },

    timestamp: {
        type: Number, // seconds into notes
        required: true,
        index: true,
    },

    order: {
        type: Number, // optional fallback ordering
    },
}, { timestamps: true });


const NotesContent = mongoose.model('NotesContent', notesContentSchema);

export default NotesContent;
