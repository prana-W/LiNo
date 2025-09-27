import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }

}, {
    timestamps: true
})