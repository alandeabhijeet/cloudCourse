const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/BlacklistToken");

module.exports.verifyToken = async (req, res, next) => {
    console.log("middleware")
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied" });

    const actualToken = token.replace("Bearer ", "");
    
    // Check if token is blacklisted
    const isBlacklisted = await BlacklistToken.findOne({ token: actualToken });
    if (isBlacklisted) return res.status(401).json({ message: "Token is blacklisted, please log in again" });

    try {
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

