import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password:{type:String,required:true,unique:true},
    isCommittee: { type: Boolean, default: false }, // Determines if the user is a committee member
    profileInfo: String, // Any additional profile information

    // Profile Picture field
    profilePicture: { type: String, default: '' }, // URL of the profile picture

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // Posts the user has liked
    
}, { timestamps: true });

export default mongoose.model('User', userSchema);
