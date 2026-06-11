import { Schema, model } from "mongoose";

// MongoDB collection name is `admins` (as per your database folder/collection).
// Fields are stored in plaintext (per your confirmation).
const adminSchema = new Schema(
  {
    logInID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    logInPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["HR", "Manager", "Director"],
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: false,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true, collection: "admins" }
);

const Admin = model("Admin", adminSchema);

export default Admin;

