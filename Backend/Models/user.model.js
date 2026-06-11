import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";

const userSchema = new Schema({
    logInID: {
        type: String,
        required: [true, "Login ID is required"],
        unique: true,
        trim: true
    },
    logInPassword: {
        type: String,
        required: [true, "Login password is required"],
        select: false  // Don't include in queries by default
    },
    fullName: {
        type: String,
        required: [true, "Full name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    phoneNumber: {
        type: Number,
        required: [true, "Phone number is required"],
        unique: true
    },
    designation: {
        type: String,
        enum: {
            values: ['Developer', 'Manager', 'HR', 'Intern'],
            message: "Designation must be one of: Developer, Manager, HR, Intern"
        },
        required: [true, "Designation is required"]
    },
    address: {
        type: String,
        trim: true
    },
    avatarUrl: {
        type: String,
        default: ""
    }
}, { timestamps: true })


userSchema.pre("save", async function (next) {
    if (!this.isModified("logInPassword")) {
        next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.logInPassword = await bcrypt.hash(this.logInPassword, salt);
    } catch (error) {
        next(error);
    }
});

const User = model("User", userSchema)

export default User