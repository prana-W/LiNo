import mongoose from "mongoose";

const lectureContentSchema = new mongoose.Schema({
    lectureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
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
        type: Number, // seconds into lecture
        required: true,
        index: true,
    },

    order: {
        type: Number, // optional fallback ordering
    },
}, { timestamps: true });


const LectureContent = mongoose.model('LectureContent', lectureContentSchema);

export default LectureContent;
