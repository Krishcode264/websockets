import mongoose from "mongoose";

import { Schema } from "mongoose";

export const userSchema = new Schema({
  name: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now, // Set default to current timestamp
  },
  id: { type: String, required: true },
  socketID: { type: String, required: true },
  isConnected: { type: Boolean, default: false },
  country: { type: String, default: "" },
  intrests: { type: [String], default: [] },
  age: { type: Number, default: 0 },
  gender: { type: String, default: "unknown" },
});
