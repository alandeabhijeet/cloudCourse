const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    details: { type: String, required: true },
    category: { type: String, required: true },
    available: { type: Boolean, default: true }
}, { timestamps: true });

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
