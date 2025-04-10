require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/index");

const courseRoutes = require("./routes/courseRoutes");
const port = process.env.PORT ;

connectDB();
app.use(cors({ origin:"http://localhost:8080", credentials: true })); 

app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.use("/api/courses", courseRoutes);


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});