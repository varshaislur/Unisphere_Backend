import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { getUserProfile, getLikedPosts } from '../controllers/userController.js';
import { createPost, likePost, addComment, deletePost, deleteComment } from '../controllers/postController.js';
import { getNotifications } from '../controllers/notificationController.js';
import userAuth from '../middlewares/userAuth.js';
import upload from '../middlewares/multerMiddleWare.js';

const router = express.Router();

// Auth routes
router.post('/register', registerUser); // User registration
router.post('/login', loginUser);       // User login

// User routes
router.get('/user/:id', userAuth, getUserProfile);        // Get user profile
router.get('/user/:id/likedPosts', userAuth, getLikedPosts); // Get liked posts by user

// Post routes
router.post('/post', userAuth, upload.single('file'), createPost); // Create a post with media
router.put('/post/:id/like', userAuth, likePost);                // Like/unlike a post
router.post('/post/:id/comment', userAuth, addComment);          // Add a comment to a post
router.delete('/post/:id', userAuth, deletePost);                // Delete a post
router.delete('/post/:postId/comment/:commentId', userAuth, deleteComment); // Delete a comment on a post

// Notification routes
router.get('/notifications', userAuth, getNotifications); // Get user notifications

export default router;
