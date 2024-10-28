import Post from '../models/Post.js';
import User from '../models/User.js';
import Notification from '../models/notification.js';
import { uploadToCloudinary } from '../middlewares/cloudinaryMiddleware.js';

// Create a new post (Only committee members can post)
export const createPost = async (req, res) => {
    if (!req.user.isCommittee) {
      return res.status(403).json({ success: false, message: "Only committee members can post" });
    }
  
    try {
      let mediaUrl = "";
      if (req.file) {
        mediaUrl = await uploadToCloudinary(req.file.path);
      }

      console.log("req.body in createPost controller:",req.body)
  
      const post = await Post.create({
        ...req.body,
        imageUrl: mediaUrl,
        createdBy: req.user.userId
      });
  
      res.status(201).json({ success: true, post });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create post", error });
    }
  };

export const getHomepagePosts = async (req, res) => {
    try {
        // Find the user and populate the 'following' field
        const user = await User.findById(req.user.userId).populate({
            path: 'following',
            match: { isCommittee: true }, // Filter only committee members
            select: '_id' // Only fetch the _id field
        });

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Get an array of committee IDs the user follows
        const committeeIds = user.following.map(followed => followed._id);

        // Find posts created by these committees
        const posts = await Post.find({ createdBy: { $in: committeeIds } })
            .populate('createdBy', 'username profilePicture') // Populate the creator's username and profile picture
            .sort({ createdAt: -1 }); // Sort posts by creation date (newest first)

        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch homepage posts', error });
    }
};
  

// Like or unlike a post
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        const user = await User.findById(req.user.userId);

        // Check if the user has already liked the post
        const hasLiked = post.likedBy.includes(req.user.userId);

        if (hasLiked) {
            // If liked, remove like
            post.likedBy.pull(req.user.userId);
            user.likedPosts.pull(post._id);
        } else {
            // If not liked, add like
            post.likedBy.push(req.user.userId);
            user.likedPosts.push(post._id);

            // Send notification to post creator
            if (post.createdBy.toString() !== req.user.userId) { // Avoid self-notification
                await Notification.create({
                    user: post.createdBy,
                    message: `${user.username} liked your post`
                });
            }
        }

        await post.save();
        await user.save();

        res.status(200).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to like/unlike post', error });
    }
};

// Add a comment to a post
export const addComment = async (req, res) => {
    try {
        // Validate text input
        if (!req.body.text || req.body.text.trim() === '') {
            return res.status(400).json({ success: false, message: 'Comment text is required' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        const user = await User.findById(req.user.userId);

        // Add the comment
        post.comments.push({
            user: req.user.userId,
            text: req.body.text,
        });

        await post.save();

        // Send notification to post creator
        if (post.createdBy.toString() !== req.user.userId) { // Avoid self-notification
            await Notification.create({
                user: post.createdBy,
                message: `${user.username} commented on your post`
            });
        }

        res.status(200).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add comment', error });
    }
};


// Delete a post (Only the creator can delete their post)
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        if (post.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ success: false, message: 'You can only delete your own posts' });
        }

        await post.deleteOne();
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.log("error:", error);
        res.status(500).json({ success: false, message: 'Failed to delete post', error });
    }
};


// Delete a comment (Only the comment author or post creator can delete the comment)
export const deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

        if (comment.user.toString() !== req.user.userId && post.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ success: false, message: 'You can only delete your own comments or comments on your posts' });
        }

        comment.deleteOne(); // Updated from comment.remove()
        await post.save();

        res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete comment', error });
    }
};
