import Post from '../models/Post';
import User from '../models/User';
import Notification from '../models/notification';

export const createPost = async (req, res) => {
    if (!req.user.isCommittee) return res.status(403).json({ success: false, message: 'Only committee members can post' });

    try {
        const post = await Post.create({ ...req.body, createdBy: req.user.userId });
        res.status(201).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create post', error });
    }
};

export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        const user = await User.findById(req.user.userId);

        if (post.likedBy.includes(req.user.userId)) {
            post.likedBy.pull(req.user.userId);
            user.likedPosts.pull(post._id);
        } else {
            post.likedBy.push(req.user.userId);
            user.likedPosts.push(post._id);
            await Notification.create({ user: post.createdBy, message: `${user.username} liked your post` });
        }

        await post.save();
        await user.save();

        res.status(200).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to like post', error });
    }
};

export const addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        post.comments.push({ user: req.user.userId, text: req.body.text });
        await post.save();

        res.status(200).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add comment', error });
    }
};
