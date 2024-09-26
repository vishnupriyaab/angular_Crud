import mongodb from "mongoose";
import User from "../interface/userInterface";
import bcrypt from "bcrypt";

const UserSchema = new mongodb.Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image:{
      type:String,
      required:false
    },
    isActive: {
      type: Boolean,
      require: false,
    },
    isBlock: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  if (typeof user.password !== "string") {
    return next(new Error("Password must be a string"));
  }
  try {
    const salt = 10;
    const hash = bcrypt.hashSync(user.password, salt);

    user.password = hash;
    next();
  } catch (error: any) {
    next(error);
  }
});

const Userdb = mongodb.model<User>("Userdbs", UserSchema);

export default Userdb;
