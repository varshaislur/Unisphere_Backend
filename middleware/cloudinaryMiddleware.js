import cloudinary from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Function to upload file to Cloudinary
export const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.v2.uploader.upload(filePath);
        fs.unlink(filePath, (err) => {
            if (err) console.log('Error deleting file:', err);
            else console.log('Deleted file after Cloudinary upload');
        });
        return result.secure_url;
    } catch (err) {
        console.error('Error uploading to Cloudinary:', err);
        throw err;
    }
};
