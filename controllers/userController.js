import User from '../models/User.js';
import Post from '../models/Post.js';

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

export const getLikedPosts = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('likedPosts');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.status(200).json({ success: true, likedPosts: user.likedPosts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch liked posts', error });
    }
};
