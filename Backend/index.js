import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './Database/db.js';   
import 'dotenv/config'
import cors from 'cors'
import userRouter from './Routes/user.route.js';
import authRouter from './Routes/auth.route.js';
import leaveRouter from './Routes/leave.route.js';

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}))  // Enable CORS for frontend with credentials
app.use(express.json())  // Parse JSON bodies
app.use(express.urlencoded({ extended: true }))  // Parse URL-encoded bodies
app.use(cookieParser());  // Parse cookies

// Connect to MongoDB
connectDB(process.env.MONGO_URI);

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter);
app.use("/api/leave", leaveRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})

