import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { getUserProfile, getLikedPosts, getOwnProfile, toggleFollowUser, getAllCommitteeProfiles } from '../controllers/userController.js';
import { createPost, likePost, addComment, deletePost, deleteComment, getHomepagePosts } from '../controllers/postController.js';
import { getNotifications, getReadNotifications, getUnreadNotifications, markNotificationAsRead } from '../controllers/notificationController.js';
import userAuth from '../middlewares/userAuth.js';
import upload from '../middlewares/multerMiddleWare.js';
import { updateProfilePicture } from '../controllers/userController.js';

const router = express.Router();

// Auth routes
router.post('/register', registerUser); // User registration
router.post('/login', loginUser);       // User login

// User routes
router.get('/user/profile', userAuth, getOwnProfile); // Get logged-in user's own profile
router.get('/user/:id', userAuth, getUserProfile);        // Get user profile
router.get('/user/:id/likedPosts', userAuth, getLikedPosts);// Get liked posts by user
router.put('/user/profilePicture', userAuth, upload.single('file'), updateProfilePicture); 
router.put('/user/:id/toggleFollow', userAuth, toggleFollowUser); // Toggle follow/unfollow a user
router.get('/users/allCommitteeProfiles', getAllCommitteeProfiles); // Route to get only committee members


// Post routes
router.post('/post', userAuth, upload.single('file'), createPost); // Create a post with media
router.put('/post/:id/like', userAuth, likePost);                // Like/unlike a post
router.post('/post/:id/comment', userAuth, addComment);          // Add a comment to a post
router.delete('/post/:id', userAuth, deletePost);                // Delete a post
router.delete('/post/:postId/comment/:commentId', userAuth, deleteComment); // Delete a comment on a post

// Homepage route for fetching posts from followed committees
router.get('/homepage', userAuth, getHomepagePosts); // Fetch posts for user's homepage


// Notification routes
router.get('/notifications', userAuth, getNotifications); // Get all user notifications
router.get('/notifications/read', userAuth, getReadNotifications); // Get only read notifications
router.get('/notifications/unread', userAuth, getUnreadNotifications); // Get only unread notifications
router.put('/notifications/:id/read', userAuth, markNotificationAsRead); // Mark a specific notification as read

export default router;
