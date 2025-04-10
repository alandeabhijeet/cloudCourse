require('dotenv').config();
const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const paymentRoutes = require("./routes/paymentRoutes");
const port = process.env.PORT ;

app.use(cors({ origin:process.env.Frontend_URL, credentials: true })); 
app.use(cookieParser());

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use("/api/payment", paymentRoutes);
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});