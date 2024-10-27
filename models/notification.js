import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User receiving the notification
    message: { type: String, required: true }, // Notification message
    read: { type: Boolean, default: false }, // Whether the notification has been read
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
