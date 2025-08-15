import mongoose from "mongoose";
const { MONGODB_URI } = process.env;
export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(MONGODB_URI as string);
    if (connection.readyState === 1) {
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
/*
import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(MONGODB_URI as string);
    if (connection.readyState === 1) {
      console.log("✅ MongoDB connected");
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    return Promise.reject(error);
  }
};
*/