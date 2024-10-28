import Notification from '../models/notification.js';

// Fetch all notifications for a user
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch notifications', error });
    }
};

// Fetch only read notifications for a user
export const getReadNotifications = async (req, res) => {
    try {
        const readNotifications = await Notification.find({ user: req.user.userId, read: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, notifications: readNotifications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch read notifications', error });
    }
};

// Fetch only unread notifications for a user
export const getUnreadNotifications = async (req, res) => {
    try {
        const unreadNotifications = await Notification.find({ user: req.user.userId, read: false }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, notifications: unreadNotifications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch unread notifications', error });
    }
};

// Mark a notification as read
export const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        res.status(200).json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to mark notification as read', error });
    }
};
