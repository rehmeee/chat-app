import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      default: "~",
    },
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    rooms:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rooms"
      }
    ],
    password: {
      type: String,
      required: true,
    },
    refreshToken:{
      type : String,
      default : ""
    },
    profilePic:{
      type: String,
      default: ""
    },
    description:{
      type: String,
      default: ""
    }
  },  
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next()
});
userSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.genrateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn : process.env.ACCESS_TOKEN_EXPIRTY
    }
  );
};
userSchema.methods.genrateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
   {
    expiresIn:  process.env.REFRESH_TOKEN_EXPIRTY
   }
  );
};

export const User = mongoose.model("User", userSchema);
