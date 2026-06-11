import User from "../Models/user.model.js";
import Admin from "../Models/admin.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/auth.js";
import { sendCredentialsEmail } from "../utils/sendEmail.js";

const handleUserSignup = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, designation, address } = req.body;

        // Basic validation
        if (!fullName || !email || !phoneNumber || !designation) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate designation
        if (!["Developer", "Manager", "HR", "Intern"].includes(designation)) {
            return res.status(400).json({ message: "Invalid designation" });
        }

        // Generate login credentials
        const logInID = designation.slice(0, 3).toUpperCase() + phoneNumber.toString().slice(-4)
        const logInPassword = Math.random().toString(36).slice(-8)

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { phoneNumber }, { logInID }]
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email or phone number" });
        }

        // Create user (password auto-hashed by pre-save hook)
        const user = await User.create({
            logInID,
            logInPassword,
            fullName,
            email,
            phoneNumber,
            designation,
            address
        });

        // Send email with credentials
        try {
            await sendCredentialsEmail(email, logInID, logInPassword, fullName);
            console.log('Welcome email sent to', email);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail signup if email fails
        }

        res.status(201).json({
            message: "User registered successfully! Check your email for login credentials.",
            data: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                designation: user.designation,
                address: user.address,
                logInID: user.logInID
            }
        });

    } catch (error) {
        console.error(error);
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const handleUserLogin = async (req, res) => {
    try {
        const { logInID, logInPassword, role } = req.body;

        if (!logInID || !logInPassword) {
            return res.status(400).json({ message: "login ID and password are required" });
        }

        // Admin login via MongoDB `admins` collection.
        // If `role` is provided, we authenticate as an admin.
        if (role) {
            const allowedRoles = ["HR", "Manager", "Director"];
            if (!allowedRoles.includes(role)) {
                return res.status(400).json({ message: "Invalid role" });
            }

            const admin = await Admin.findOne({ logInID, role });
            if (!admin) {
                return res.status(403).json({ message: "Invalid admin credentials for selected role" });
            }

            // Stored as plaintext in your DB.
            if (logInPassword !== admin.logInPassword) {
                return res.status(403).json({ message: "Invalid admin credentials for selected role" });
            }

            const token = generateToken(admin._id);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
           
            return res.status(200).json({
                message: "Login successful",
                token,
                data: {
                    role: admin.role,
                    logInID: admin.logInID,
                    fullName: admin.fullName,
                    email: admin.email,
                }
            });
        }


        const user = await User.findOne({ logInID }).select("+logInPassword");
        if (!user) {
            // Admin can login using predefined credentials even without a DB record.
            if (role) {
                const token = generateToken("admin");
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                });
                return res.status(200).json({
                    message: "Login successful",
                    token,
                    data: { role, logInID }
                });
            }
            return res.status(400).json({ message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(logInPassword, user.logInPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid login credentials" });
        }

        if (role) {
            const expectedDesignation = role === "Director" ? "Manager" : role;
            if (user.designation !== expectedDesignation) {
                return res.status(403).json({ message: "Role not authorized for this account" });
            }
        }


        const token = generateToken(user._id);

        const userData = await User.findById(user._id).select('-logInPassword');

        // Set httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(200).json({
            message: "Login successful",
            token,
            data: userData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const updates = req.body;

        // Validate allowed fields
        const allowedFields = ['fullName', 'email', 'phoneNumber', 'designation', 'address'];
        const validUpdates = {};
        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key)) {
                validUpdates[key] = value;
            }
        }

        if (Object.keys(validUpdates).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            validUpdates,
            { returnDocument: 'after', runValidators: true }
        ).select('-logInPassword');

        res.json({
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email or phone already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const user = await User.findById(userId).select('+logInPassword');
        const isMatch = await bcrypt.compare(currentPassword, user.logInPassword);

        if (!isMatch) {
            return res.status(400).json({ message: 'Current password incorrect' });
        }

        // Update password (pre-save hook will hash)
        user.logInPassword = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export { handleUserSignup, handleUserLogin, updateProfile, changePassword };
