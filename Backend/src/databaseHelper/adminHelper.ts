import User from "../interface/userInterface";
import Userdb from "../models/userModel";

export default {
  getAllUser: async (): Promise<User[] | []> => {
    try {
      return await Userdb.find({}, { password: 0 }).sort({createdAt:-1});
    } catch (err: any) {
      throw err;
    }
  },

  updateUser: async (userId: string, data: Partial<User>) => {
    console.log("Entered updateUser!");
    try {
      return await Userdb.findByIdAndUpdate(userId, data, { new: true });
    } catch (err: any) {
      throw err;
    }
  },

  deleteUser: async (userId: string) => {
    console.log("Entered deleteUser!");
    try {
      const deletedUser = await Userdb.findByIdAndDelete(userId);
      if (!deletedUser) {
        console.log(`User with ID ${userId} not found.`);
        return null;
      }
      console.log(`User with ID ${userId} deleted successfully.`);
      return deletedUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
