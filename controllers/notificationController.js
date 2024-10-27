import Notification from '../models/notification.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch notifications', error });
    }
};
