import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connection=await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);

  }
};

export default connectDB;
