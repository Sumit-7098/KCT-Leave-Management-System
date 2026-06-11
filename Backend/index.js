import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './Database/db.js';
import 'dotenv/config'
import cors from 'cors'
import userRouter from './Routes/user.route.js';
import authRouter from './Routes/auth.route.js';
import leaveRouter from './Routes/leave.route.js';
import avatarRouter from './Routes/avatar.route.js';
import employeeRouter from './Routes/employee.route.js';
import employeeManagementRouter from './Routes/employeeManagement.route.js';
import leaveAdminRouter from './Routes/leaveAdmin.route.js';
import leaveBalanceAdminRouter from './Routes/leaveBalanceAdmin.route.js';
import notificationRouter from './Routes/notification.route.js';


// Initialize Express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
<<<<<<< HEAD
  origin: "*",
=======
  origin: ['http://localhost:5173', "http://192.168.148.1:5173"],
>>>>>>> 91a7b6ad2951c6a75f61f9b5733f94d2a8f16e72
  credentials: true
}))  // Enable CORS for frontend with credentials
app.use(express.json())  // Parse JSON bodies
app.use(express.urlencoded({ extended: true }))  // Parse URL-encoded bodies
app.use(cookieParser());  // Parse cookies

// Connect to MongoDB
connectDB(process.env.MONGO_URI);

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter);
app.use("/api", avatarRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/employee-management", employeeManagementRouter);

app.use("/api/leave", leaveRouter);
app.use("/api/leave", leaveAdminRouter);
app.use("/api/leave", leaveBalanceAdminRouter);
app.use("/api/notifications", notificationRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
})


