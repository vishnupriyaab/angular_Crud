import User from "../interface/userInterface";
import Userdb from "../models/userModel";

async function isUserExist(email: string) {
  return await Userdb.findOne({ email });
}

async function createUser(data: User) {
  const userData = new Userdb(data);
  userData.isActive = true;
  userData.isBlock = false;
  await userData.save();
  console.log("user saved");
  return userData;
}
async function isUser(userId: string) {
  const userData = await Userdb.findById(userId);
  try {
    if (!userData) {
      throw new Error("User Not Found");
    }
    return userData;
  } catch (error: any) {
    throw error;
  }
}
async function updateUser(userId: string, data: Partial<User>) {
  console.log("enteredddd!");
  return await Userdb.findByIdAndUpdate(userId, data, { new: true });
}
async function blockUnblockUser(userId: string, isBlock: boolean) {
  console.log("Updating user with ID:", userId);
  const data = { isBlock };
  
  console.log(data,"qiije");
   const updatedUser = await Userdb.findByIdAndUpdate(userId, { $set: data }, { new: true });
  console.log(updatedUser,"sdefghjk");
  return updatedUser;
}
export default {
  createUser,
  isUserExist,
  isUser,
  updateUser,
  blockUnblockUser
};
