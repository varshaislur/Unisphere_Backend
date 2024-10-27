import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connection=await mongoose.connect(process.env.MONGO_URI ,{dbName:'Unisphere'});
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);

  }
};

export default connectDB;
