import User from '../models/User.js';
import Post from '../models/Post.js';
import { uploadToCloudinary } from '../middlewares/cloudinaryMiddleware.js';


export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('followers following');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const userPosts = await Post.find({ createdBy: user._id });
        res.status(200).json({ success: true, user, posts: userPosts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch user profile', error });
    }
};

export const updateProfilePicture = async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Upload the file to Cloudinary
        const profileImageUrl = await uploadToCloudinary(req.file.path);

        // Update the user's profile picture URL
        const user = await User.findByIdAndUpdate(req.user.userId, { profilePicture: profileImageUrl }, { new: true });

        res.status(200).json({ success: true, message: 'Profile picture updated', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update profile picture', error });
    }
};

export const getLikedPosts = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('likedPosts');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.status(200).json({ success: true, likedPosts: user.likedPosts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch liked posts', error });
    }
};
