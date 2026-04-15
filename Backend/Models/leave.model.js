import { Schema, model } from "mongoose";
import User from "./user.model.js";

const leaveSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    leaveType: {
        type: String,
        required: [true, "Leave type is required"],
        enum: {
            values: ["Annual Leave", "Sick Leave", "Casual Leave", "Unpaid Leave", "Compensatory Off", "Gate Pass", "OD (On Duty)"],
            message: "Invalid leave type"
        }
    },
    inTime: {
        type: String,
        default: null
    },
    outTime: {
        type: String,
        default: null
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"]
    },
    endDate: {
        type: Date,
        required: [true, "End date is required"]
    },
    reason: {
        type: String,
        required: [true, "Reason is required"],
        maxlength: [500, "Reason cannot exceed 500 characters"]
    },
    document: {
        type: String, // file path
        default: null
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

const Leave = model("Leave", leaveSchema);

export default Leave;

