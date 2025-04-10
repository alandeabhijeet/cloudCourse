require('dotenv').config();
const express = require("express");


const router = express.Router();

const { createOrder , verifyPayment } = require("../controllers/paymentControllers");

router.post('/create-order', createOrder );
router.get('/verify-payment', verifyPayment );

module.exports = router;