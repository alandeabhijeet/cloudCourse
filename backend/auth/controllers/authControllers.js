require('dotenv').config();
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BlacklistToken = require("../models/BlacklistToken");
const REDIRECT = process.env.REDIRECT 

module.exports.signup = async (req, res) => {
    try {
        console.log("Signup request received"); // Debugging line
        const { username, password } = req.body;

        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: "User already exists" });

        user = new User({ username, password });
        await user.save();

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "4h" });
        console.log("User registered successfully:", user.username);

        console.log("Token generated:", token); // Debugging line

        console.log("Redirect URL:", REDIRECT); // Debugging line
        res.status(201).json({
            message: "User registered successfully",
            token,
            redirectTo: REDIRECT // Frontend should use this URL with the token in headers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.login = async (req, res) => {
    try {
        console.log("Login request received"); // Debugging line
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await user.comparePassword(password);
        console.log("Password match:", isMatch); // Debugging line
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "4h" });
        console.log("User logged in successfully:", user.username); // Debugging line
        console.log("Token generated:", token); // Debugging line
        res.json({
            message: "Login successful",
            token,
            redirectTo: REDIRECT // Frontend should use this URL with the token in headers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports.logout = async (req, res) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return res.status(400).json({ message: "No token provided" });

        await new BlacklistToken({ token }).save();

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.checkOwner = async (req, res) => {
    try {
        console.log("Check owner request received"); // Debugging line
        const user = await User.findById(req.user.id);
        
        if (!user) return res.status(404).json({ message: "User not found" });
        console.log("User found:", user); // Debugging line
        
        // ✅ Fix: Get courseId from query instead of params
        const { courseId } = req.query;
        console.log("Received course ID:", courseId); // Debugging line

        if (!courseId) {
            return res.status(400).json({ message: "courseId is required" });
        }

        // ✅ Fix: Convert ObjectId to string for comparison
        const isOwner = user.owner.some(id => id.toString() === courseId);
        console.log("Is owner:", isOwner); // Debugging line

        res.json({ isOwner });

    } catch (error) {
        console.error("Error checking owner:", error.message);
        res.status(500).json({ message: error.message });
    }
};


module.exports.checkBuyer = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { courseId } = req.params;
        const isBuyer = user.buy_course.includes(courseId);

        res.json({ isBuyer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports.deleteOwnerIdFromUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { courseId } = req.body;

        // Remove courseId from owner's list
        user.owner = user.owner.filter(id => id !== courseId);
        await user.save();

        res.json({ message: "Course ID removed from user successfully" });

    } catch (error) {
        console.error("Error removing course ID from user:", error.message);
        res.status(500).json({ message: error.message });
    }
};












module.exports.sendCourseOwnerId = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "Course IDs sent", ownerCourseIds: user.owner });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.sendCourseBuyerId = async (req, res) => {
    try {
        console.log("Send course buyer ID request received"); // Debugging line
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        console.log("User found:", user); // Debugging line
        res.json({ message: "Course IDs sent", buyCourseIds: user.buy_course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
