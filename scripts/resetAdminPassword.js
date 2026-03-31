import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

dotenv.config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find admin
    const admin = await Admin.findOne({ email: "admin@inshape.com" });

    if (!admin) {
      console.log("Admin not found! Creating new admin...");

      const newAdmin = new Admin({
        username: "admin",
        email: "admin@inshape.com",
        password: "admin123",
      });

      await newAdmin.save();
      console.log("Admin created successfully!");
    } else {
      // Update password
      admin.password = "admin123";
      await admin.save();
      console.log("Password reset successfully!");
    }

    console.log("\nLogin credentials:");
    console.log("Email: admin@inshape.com");
    console.log("Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

resetPassword();
