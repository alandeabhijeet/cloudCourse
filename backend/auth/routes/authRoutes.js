require('dotenv').config();
const express = require("express");
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { signup, login, logout , checkOwner ,deleteOwnerIdFromUser , checkBuyer , sendCourseBuyerId , sendCourseOwnerId} = require("../controllers/authControllers");
const router = express.Router();
const axios = require('axios'); 
const mongoose = require('mongoose');

const { verifyToken } = require("../middlewares/authMiddleware");
router.post("/signup",signup );
router.post("/login",login );
router.post("/logout",verifyToken ,  logout);
const User = require("../models/User");
router.get("/checkowner" ,verifyToken ,  checkOwner); 
router.get("/checkbuyer" ,verifyToken ,  checkBuyer);

router.delete("/deleteowneridfromuser" ,verifyToken ,  deleteOwnerIdFromUser);

router.get("/sendcoursebuyerid" ,verifyToken ,  sendCourseBuyerId);
router.get("/sendcourseownerid" ,verifyToken ,  sendCourseOwnerId);



router.get("/verify-token", verifyToken, (req, res) => {
  console.log("Token verified successfully");
  console.log("User ID:", req.user.id); // Debugging line
    res.json({ userId: req.user.id });
});

router.post("/add-owner-course", verifyToken, async (req, res) => {
    try {
        console.log("Add owner course called");
      const { userId, courseId } = req.body;
        console.log("User ID:", userId); // Debugging line
        console.log("Course ID:", courseId); // Debugging line
      if (!userId || !courseId) {
        return res.status(400).json({ message: "Missing userId or courseId" });
      }
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.owner.push(courseId);
      await user.save();
  
      res.json({ message: "Course added to owner", user });
    } catch (error) {
      console.error("❌ Error adding course to owner:", error.message);
      res.status(500).json({ message: error.message });
    }
  });
  



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


router.post("/add-buy-course", verifyToken, async (req, res) => {
  try {
    const { courseId, paymentData } = req.body;
    
    // Validate courseId
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid course ID" 
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Check if already purchased
    if (user.buy_course.some(id => id.toString() === courseId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Course already purchased" 
      });
    }


    user.buy_course.push(courseId);
    await user.save();

    return res.json({ 
      success: true,
      message: "Course added successfully",
      courseId: courseId
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

module.exports = router;