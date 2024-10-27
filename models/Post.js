import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String }, // URL of the uploaded image (if any)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // reference to the user or committee who created the post

    // Likes field
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // users who liked this post

    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: String,
            createdAt: { type: Date, default: Date.now }
        }
    ]
    
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
