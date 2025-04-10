require('dotenv').config();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const axios = require('axios'); 
const mongoose = require('mongoose');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
exports.createOrder = async (req, res) => {
  try {
    
    const token = req.header("Authorization"); 
    
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    const response = await axios.get(`${USER_SERVICE_URL}/verify-token`, {
        headers: { Authorization: token }
    });
    const userId = response.data.userId;
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
        userId: userId,
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
}

exports.verifyPayment = async (req, res) => {
    try {
      const { courseId, paymentData } = req.body;
      const userId = req.user._id;
  
      if (!courseId || !paymentData) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Verify signature
      const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      shasum.update(`${paymentData.razorpay_order_id}|${paymentData.razorpay_payment_id}`);
      const digest = shasum.digest('hex');
  
      if (digest !== paymentData.razorpay_signature) {
        return res.status(400).json({ error: 'Invalid payment signature' });
      }
  
      // Verify payment with Razorpay (optional but recommended)
      const payment = await razorpay.payments.fetch(paymentData.razorpay_payment_id);
      if (payment.status !== 'captured') {
        return res.status(400).json({ error: 'Payment not captured' });
      }
  
      // Update user's purchased courses
      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { purchasedCourses: courseId } },
        { new: true }
      );
  
      // Update order status in database
      await Order.findOneAndUpdate(
        { razorpayOrderId: paymentData.razorpay_order_id },
        {
          status: 'completed',
          razorpayPaymentId: paymentData.razorpay_payment_id,
          razorpaySignature: paymentData.razorpay_signature
        }
      );
  
      res.status(200).json({ 
        message: 'Payment verified and course added successfully',
        courseId,
        paymentId: paymentData.razorpay_payment_id
      });
    } catch (error) {
      console.error('Payment verification error:', error);
      res.status(500).json({ 
        error: 'Payment verification failed',
        details: error.error?.description || error.message 
      });
    }
};