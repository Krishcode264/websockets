import mongoose from "mongoose";
import { UserSchemaType } from "core";
import { userSchema } from "../schemas/userSchema";

export const UserData = mongoose.model("SocketUsers", userSchema);

export const saveUserData = async (
  data: UserSchemaType
): Promise<UserSchemaType | null> => {
  try {
    const newUser = new UserData({ ...data });
    const savedUser = await newUser.save();
    return savedUser;
  } catch (err) {
    console.log(err, "err saving connected socket user");
    return null;
  }
};

export const deleteUserData = async (
  id: string
): Promise<UserSchemaType | null> => {
  try {
    const deletedUser = await UserData.findOneAndDelete({ socketID: id });
    return deletedUser;
  } catch (err) {
    console.log(err, "err deleting user ");
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const connectedUsers = await UserData.find();
    return connectedUsers;
  } catch {
    return null;
  }
};

export const findUserById = async (id: string): Promise<string | null> => {
  try {
    const targetUser: UserSchemaType | null = await UserData.findOne({ id });

    if (!targetUser) {
      return null; // Return null when user is not found
    }

    return targetUser.socketID;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error; // Handle the error or rethrow for higher-level handling
  }
};
