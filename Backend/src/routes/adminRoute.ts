import { Router } from "express";
import { adminAddUser, adminLogin, blockUnblock, deleteUser, editedUser, showAllUsers } from "../controllers/adminCtrl";

export const adminRoute:Router = Router();

adminRoute.post('/adminLogin',adminLogin)
adminRoute.get('/showAllUsers',showAllUsers)
adminRoute.put('/editedUser',editedUser)
adminRoute.put('/deleteUser',deleteUser)
adminRoute.put('/deleteUser',deleteUser)
adminRoute.post('/addUser',adminAddUser)
adminRoute.patch('/blockUnblockUser',blockUnblock)
