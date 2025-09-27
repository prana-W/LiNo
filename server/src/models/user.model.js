import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    }
}, {timestamps: true});

// Add password hashing
userSchema.pre('save', function(next) {

})

const User = mongoose.model("User", userSchema);

export default User;