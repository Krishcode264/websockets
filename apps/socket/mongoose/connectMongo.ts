

import mongoose from 'mongoose';
import { ConnectOptions } from 'mongoose';

export const connectMongo = async (): Promise<void> => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/SocketUsers");
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Connection error:", error);
  }
};



