import User from '../models/User.js';
import Post from '../models/Post.js';
import { uploadToCloudinary } from '../middlewares/cloudinaryMiddleware.js';

export const getAllCommitteeProfiles = async (req, res) => {
    try {
        const committeeMembers = await User.find({ isCommittee: true }).select('username profilePicture followers following');
        res.status(200).json({ success: true, users: committeeMembers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch committee members', error });
    }
};

export const getOwnProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('followers following');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const userPosts = await Post.find({ createdBy: user._id });
        res.status(200).json({ success: true, user, posts: userPosts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch user profile', error });
    }
};

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

export const toggleFollowUser = async (req, res) => {
    try {
        const userToToggle = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.userId);

        if (!userToToggle) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if already following
        const isFollowing = currentUser.following.includes(userToToggle._id);

        if (isFollowing) {
            // Unfollow: Remove each other's IDs from followers and following
            currentUser.following.pull(userToToggle._id);
            userToToggle.followers.pull(currentUser._id);
            await currentUser.save();
            await userToToggle.save();
            res.status(200).json({ success: true, message: 'User unfollowed successfully' });
        } else {
            // Follow: Add each other's IDs to followers and following
            currentUser.following.push(userToToggle._id);
            userToToggle.followers.push(currentUser._id);
            await currentUser.save();
            await userToToggle.save();
            res.status(200).json({ success: true, message: 'User followed successfully' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to toggle follow status', error });
    }
};

