const mongoose = require("mongoose");
const dburl = process.env.ATLAS_URL;

async function connectDB() {
    try {
        await mongoose.connect(dburl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1); 
    }
}

module.exports = connectDB;
