import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const options = process.env.MONGO_DB ? { dbName: process.env.MONGO_DB } : {};
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
