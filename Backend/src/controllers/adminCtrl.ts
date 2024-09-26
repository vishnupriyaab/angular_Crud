import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../interface/userInterface";
import adminHelper from "../databaseHelper/adminHelper";
import userHelper from "../databaseHelper/userHelper";

function generateJwtToken(email: string, type: string, secretKey: string) {
  const payload = { email, type };
  const options = { expiresIn: "1h" };
  return jwt.sign(payload, secretKey, options);
}

export async function adminLogin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const adminEmail: string = process.env.ADMIN_EMAIL!;
    console.log(adminEmail, "adminEmail");
    const adminPassword: string = process.env.ADMIN_PASSWORD!;
    console.log(adminPassword, "adminPassword");
    console.log(req.body, "osyyyysysysy");

    if (adminEmail !== req.body.email) {
      res.status(401).json({
        message: "No admin with that email",
        err: "email",
        errOpt: "notExist",
      });
      return;
    }

    if (adminPassword !== req.body.password) {
      res.status(401).json({
        message: "Incorrect Password",
        err: "password",
        errOpt: "infoErr",
      });
      return;
    }

    const token: string = generateJwtToken(
      adminEmail,
      "Admin",
      process.env.JWTSECRETKEY!
    );

    res.status(200).json({
      message: "Successfuly Logged in",
      token,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function showAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userData: User[] | [] = await adminHelper.getAllUser();
    res.status(200).json({
      userData,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function editedUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.body._id;
    const editedUserData = req.body;
    await adminHelper.updateUser(userId, editedUserData);

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.body._id;
    console.log(userId, "userId1234567890");
    await adminHelper.deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
  }
}

export async function adminAddUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const alreadyUserExist: User | null = await userHelper.isUserExist(
      req.body.email
    );

    if (alreadyUserExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const userData = await userHelper.createUser(req.body);
    res
      .status(201)
      .json({ message: "User added successfully", user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    next(error);
  }
}
export async function blockUnblock(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.body, "qwertyuiolkjhvcxcvbnm,2q3w456789i0op[l;.");
    const userId: string = req.body._id;
    console.log(userId, "userid");

    const isBlockUnblock = req.body.isBlock;
    console.log(isBlockUnblock, "isBlockUnblock");
    const data = await userHelper.blockUnblockUser(userId, isBlockUnblock);
    res.status(200).json({message:'successful', data })
  } catch (error) {
    console.log(error);
  }
}
