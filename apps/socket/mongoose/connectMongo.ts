

import mongoose from 'mongoose';
import { ConnectOptions } from 'mongoose';

export const connectMongo = async (uri:string): Promise<void> => {
  try {
    await mongoose.connect(uri!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Connection error:", error);
  }
};



