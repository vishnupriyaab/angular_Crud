import mongodb from "mongoose";
import bcrypt from "bcrypt";
import Admin from "../interface/adminInterface";



const AdminSchema = new mongodb.Schema<Admin>({
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true, 
    },
  });
  
  // Hash the admin password before saving
  AdminSchema.pre("save", function (next) {
    const admin = this;
  
    if (!admin.isModified("password")) return next();
  
    if (typeof admin.password !== "string") {
      return next(new Error("Password must be a string"));
    }
  
    try {
      const salt = 10;
      const hash = bcrypt.hashSync(admin.password, salt);
  
      admin.password = hash;
      next();
    } catch (error: any) {
      next(error);
    }
  });
  
  // Create the Admin model
  const Admindb = mongodb.model<Admin>("Admindbs", AdminSchema);
  
  export default Admindb;