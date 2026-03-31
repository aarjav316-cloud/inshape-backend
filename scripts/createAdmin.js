import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@inshape.com" });

    if (existingAdmin) {
      console.log("Admin already exists!");
      console.log("Email:", existingAdmin.email);
      console.log("Username:", existingAdmin.username);
      process.exit(0);
    }

    // Create new admin
    const admin = await Admin.create({
      username: "admin",
      email: "admin@inshape.com",
      password: "admin123", // This will be hashed automatically
    });

    console.log("Admin created successfully!");
    console.log("Email:", admin.email);
    console.log("Password: admin123");
    console.log("\nYou can now login with these credentials.");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
