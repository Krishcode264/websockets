

import mongoose from 'mongoose';

export const connectMongo = async (): Promise<void> => {
  try {
    await mongoose.connect("mongodb://localhost:27017/SocketUsers");
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Connection error:", error);
  }
};



