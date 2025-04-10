require('dotenv').config();
const express = require("express");
const app = express();

const connectDB = require("./config/index");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const port = process.env.PORT ;

connectDB();
app.use(cors({ origin:process.env.Frontend_URL, credentials: true })); 
app.use(cookieParser());

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use("/api/auth", authRoutes);


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});