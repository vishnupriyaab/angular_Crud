import mongoose from "mongoose";

export default interface User{
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    image:string;
    password: string;
    isActive:boolean;
    isBlock:boolean;
}
