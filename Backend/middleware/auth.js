import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";
import Admin from "../Models/admin.model.js";

const generateToken = (payload) => {
    return jwt.sign({ payload }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

const verifyToken = async (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }
        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Try to authenticate as a User first.
        const user = await User.findById(decoded.payload).select('-logInPassword');
        if (user) {
            req.user = user;
            return next();
        }

        // If not a user, try Admin.
        const admin = await Admin.findById(decoded.payload).select('-logInPassword');
        if (!admin) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = admin;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export { generateToken, verifyToken };

