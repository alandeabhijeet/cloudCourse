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

router.post('/create-order', verifyToken, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, courseId } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid course ID is required'
      });
    }

    const amountInPaise = Math.round(amount * 100);

    const shortReceipt = `crse_${Date.now()}`.slice(0, 40); // Example: "crse_1744137706852" (17 chars)

    // Create order
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: shortReceipt, // Using the shorter receipt ID
      payment_capture: 1,
      notes: {
        courseId,
        userId: req.user.id,
        fullReceipt: receipt // Store the original receipt in notes if needed
      }
    });

    console.log("Order created successfully:", order.id);
    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ // Changed to 400 since Razorpay returns 400 for validation errors
      success: false,
      message: 'Failed to create order',
      error: error.error?.description || error.message
    });
  }
});
// Add Course to User Endpoint
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

    // Payment verification


      // Generate signature



      // Verify payment status


    // Add course to user
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