import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
