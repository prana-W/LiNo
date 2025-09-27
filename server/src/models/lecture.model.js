import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "New Lecture",
    },
    link: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        default: ""
    },
    summarised_content: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    playlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
        default: "Recently-Added" // add the lecture to the "Recently Added" playlist by default
    },
    isFavourite: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;