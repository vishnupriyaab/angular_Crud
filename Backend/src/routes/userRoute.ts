
import { Router } from "express";
import { getUserData, loginUser, userRegister, userUpdate } from "../controllers/userCtrl";

export const userRoute:Router = Router();

userRoute.post('/login',loginUser);
userRoute.post('/register',userRegister)
userRoute.get('/getUserData',getUserData)

userRoute.post('/update',userUpdate)