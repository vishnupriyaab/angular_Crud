import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../interface/userInterface";
import userHelper from "../databaseHelper/userHelper";
import bcrypt from "bcrypt";
import { uploadCloudinary } from "../cloudinary/cloudinary";

function generateJwtToken(userId: string, email: string, secretKey: string) {
  const payload = { userId, email };
  const options = { expiresIn: "1h" };
  return jwt.sign(payload, secretKey, options);
}

export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user: User | null = await userHelper.isUserExist(req.body.email);
    console.log(user, "user-userCntrl");

    if (!user) {
      console.log("User with this email not found");
      res.status(404).json({ message: "User with this email not found" });
      return;
    }

    const isPasswordValid: any = bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      console.log("Invalid password");
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    // Password is valid, generate JWT token
    if (!process.env.JWTSECRETKEY) {
      console.error("JWT secret key is not defined");
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    const token: string = generateJwtToken(
      user._id!.toString(),
      user.email,
      process.env.JWTSECRETKEY
    );

    res.status(200).json({ message: "Login successful", token , user });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function userRegister(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const alreadyUserExist: User | null = await userHelper.isUserExist(
      req.body.email
    );

    if (alreadyUserExist) {
      console.log("Email already exists");
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    const userData = await userHelper.createUser(req.body);

    if (!process.env.JWTSECRETKEY) {
      console.error("JWT secret key is not defined");
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    const token: string = generateJwtToken(
      userData._id.toString(),
      userData.email,
      process.env.JWTSECRETKEY
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getUserData(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const token: string | undefined = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }
    if (!process.env.JWTSECRETKEY) {
      return res.status(500).json({ message: "Internal server error" });
    }

    const decoded = jwt.verify(token, process.env.JWTSECRETKEY) as JwtPayload;

    const userId = decoded.userId;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userData = await userHelper.isUser(userId);
    // console.log(userData,"userData-userControlzxcbhn");

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Valid token", userData });
  } catch (error) {
    console.log(error);
  }
}

export async function userUpdate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const userId = await userHelper.isUserExist(req.body.email);
    const updatedData = req.body;
    
    const existingUser = await userHelper.isUserExist(updatedData.email);
    if (
      existingUser &&
      existingUser?._id?.toString() !== userId?.id?.toString()
    ) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    updatedData.image = await uploadCloudinary(updatedData.image)
    
    console.log(updatedData, "updatedData");
    const updatedUser = await userHelper.updateUser(userId?.id, updatedData);
    console.log(updatedUser, "updatedUser");

    res
      .status(200)
      .json({ message: "User updated successfully", userData: updatedUser });
  } catch (error) {
    console.log(error);
  }
}
