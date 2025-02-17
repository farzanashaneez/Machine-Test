import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../model/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import OTP from "../model/OTP";
import { sendEmail } from "../utils/email";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, phoneNumber, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("register ===========>",password,"hashed",hashedPassword)

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = new User({
      email,
      phoneNumber,
      password:password,
      verificationToken,
      isEmailVerified: false,
    });
console.log(user)
    await user.save();

    // Generate verification link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    // Send verification email with a clickable link
    const emailText = `Please click the following link to verify your email address: ${verificationLink}`;
    const emailHtml = `
      <p>Please click the following link to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
    `;

    await sendEmail(email, emailText, emailHtml);

    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password,email } = req.body;
console.log(password,email)
    const user = await User.findOne({ email: email });

    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 401;
      return next(error);
    }
if(!user.emailVerified){
  const error: any = new Error("Email not verified");
  error.statusCode = 401;
  return next(error);
}
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("====>",password, user.password,isPasswordValid)

    if (!(await bcrypt.compare(password, user.password))) {
      const error: any = new Error("Invalid password");
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign(
      { userId: user._id ,email:user.email},
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    res.status(200).json({ token, userId: user._id,email:user.email });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }
    console.log(req.body,user)




    user.password = password;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    await OTP.create({ email, otp });

    // Send OTP to user's email
    await sendEmail(email, "Password Reset OTP", `Your OTP is: ${otp}`);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    next(error);
  }
};

export const validateOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;

    const otpDoc = await OTP.findOne({ email, otp });
    if (!otpDoc) {
      const error: any = new Error("Invalid or expired OTP");
      error.statusCode = 400;
      return next(error);
    }

    // OTP is valid, delete it from the database
    await OTP.deleteOne({ _id: otpDoc._id });

    res.status(200).json({ message: "OTP validated successfully" });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ verificationToken: token });
console.log("=======>",user,token)
    if (!user) {
      const error: any = new Error("Invalid verification token");
      error.statusCode = 404;
      return next(error);
    }

    user.emailVerified = true;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const findUser=async (req:Request,res:Response,next:NextFunction)=>{
try{
const {id}=req.params;
if(id){
  const user=await User.findById(id)
  if(!user){
    const error: any = new Error("User Not Found");
      error.statusCode = 404;
      return next(error);
  }
  res.json(user)
}
}
catch(err){
  next(err)
}
}