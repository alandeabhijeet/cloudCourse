require('dotenv').config();
const Course = require("../models/course");
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const axios = require("axios");

module.exports.getCourses = async (req, res) => {
    try {
        console.log("give courses");
        const token = req.header("Authorization"); 

        if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

        const response = await axios.get(`${USER_SERVICE_URL}/verify-token`, {
            headers: { Authorization: token }
        });

        const userId = response.data.userId; 
        const courses = await Course.find();

        res.json({ userId, courses });
    } catch (error) {
        console.error("Token Verification Failed:", error.response?.data || error.message);

        return res.status(401).json({
            message: "Unauthorized: Invalid token",
            redirectTo: `${USER_SERVICE_URL}/login`
        });
    }
};



module.exports.getCourseById = async (req, res) => {
    try {
        const token = req.header("Authorization"); 

        if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

        const response = await axios.get(`${USER_SERVICE_URL}/verify-token`, {
            headers: { Authorization: token }
        });

        const userId = response.data.userId; 
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.json(course , userId);
    } catch (error) {
        console.error("Token Verification Failed:", error.response?.data || error.message);

        return res.status(401).json({
            message: "Unauthorized: Invalid token",
            redirectTo: `${USER_SERVICE_URL}/login`
        });
    }
}


module.exports.buyCourse = async (req, res) => {
    try {
        
        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

        // Step 1: Verify User
        const userResponse = await axios.get(`${USER_SERVICE_URL}/verify-token`, {
            headers: { Authorization: token },
        });

        const userId = userResponse.data.userId; // Get user ID from token

        // Step 2: Check if Course Exists
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Step 3: Add Course to User’s Bought Courses
        await axios.post(`${USER_SERVICE_URL}/add-buy-course`, {
            userId,
            courseId: course._id,
        }, {
            headers: { Authorization: token }
        });

        res.json({ message: "Course purchased successfully", courseId: course._id });
    } catch (error) {
        console.error("❌ Error purchasing course:", error.response?.data || error.message);
        res.status(400).json({ error: error.message });
    }
};



module.exports.createCourse = async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }
      
      // Step 1: Verify User by calling User Microservice
      const userResponse = await axios.get(`${USER_SERVICE_URL}/verify-token`, {
        headers: { Authorization: token },
      });
      console.log("User Response:", userResponse.data); // Debugging line
      const userId = userResponse.data.userId;
      if (!userId) {
        return res.status(403).json({ message: "Invalid user token" });
      }
  
      // Step 2: Create the course
      const newCourse = new Course({ ...req.body, ownerId: userId });
      await newCourse.save();
      console.log("New Course Created:", newCourse); // Debugging line
      // Step 3: Add Course ID to Owner Field in User Microservice
      await axios.post(
        `${USER_SERVICE_URL}/add-owner-course`,
        { userId, courseId: newCourse._id },
        { headers: { Authorization: token } }
      );
  
      res.status(201).json(newCourse);
    } catch (error) {
      console.error("❌ Error creating course:", error.response?.data || error.message);
      res.status(400).json({ error: error.message });
    }
  };

module.exports.updateCourse = async (req, res) => {
    try {
        console.log("Update course called Course");
        const token = req.header("Authorization"); 

        if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

        const response = await axios.get(`${USER_SERVICE_URL}/verify-token`, {
            headers: { Authorization: token }
        });

        // ✅ Check if user owns the course
        const ownerResponse = await axios.get(`${USER_SERVICE_URL}/checkowner`, {
            headers: { Authorization: token },
            params: { courseId: req.params.id }
        });
        console.log("Owner Response:", ownerResponse.data); // Debugging line

        if (!ownerResponse.data.isOwner) {
            return res.status(403).json({ message: "Unauthorized: Not the course owner" });
        }

        // ✅ Proceed with course update
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" });

        course.title = req.body.title || course.title;
        course.details = req.body.details || course.details;
        course.category = req.body.category || course.category;
        course.available = req.body.available !== undefined ? req.body.available : course.available;

        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } catch (error) {
        console.error("Error updating course:", error.response?.data || error.message);
        res.status(400).json({ error: error.message });
    }
};

module.exports.deleteCourse = async (req, res) => {
    try {
        console.log("Delete course called Course");
        console.log("Course ID:", req.params.id); // Debugging line
        const token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        await axios.get(`${USER_SERVICE_URL}/verify-token`, {
            headers: { Authorization: token }
        });

        const ownerResponse = await axios.get(`${USER_SERVICE_URL}/checkowner`, {
            headers: { Authorization: token },
            params: { courseId: String(req.params.id) }
        });
        console.log("Owner Response:", ownerResponse.data); // Debugging line

        if (!ownerResponse.data.isOwner) {
            return res.status(403).json({ message: "Unauthorized: Not the course owner" });
        }

        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        await axios.delete(`${USER_SERVICE_URL}/deleteowneridfromuser`, {
            headers: { Authorization: token },
            data: { courseId: req.params.id }
        });

        res.json({ message: "Course deleted successfully and removed from owner's list" });

    } catch (error) {
        console.error("Error deleting course:", error.response?.data || error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports.ownerCourses = async (req, res) => {
    try {
        const token = req.header("Authorization"); 

        if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

        const response = await axios.get(`${USER_SERVICE_URL}/verify-token`, {
            headers: { Authorization: token }
        });


        const userResponse = await axios.get(`${USER_SERVICE_URL}/sendcourseownerid`, {
            headers: { Authorization: token },
        });

        const { userId, ownerCourseIds } = userResponse.data;

        if (!ownerCourseIds || ownerCourseIds.length === 0) {
            return res.status(400).json({ message: "No owned course IDs provided" });
        }

        // Fetch owned course details from DB
        const courses = await Course.find({ _id: { $in: ownerCourseIds } });

        res.json({ userId, courses });
    } catch (error) {
        console.error("❌ Error fetching owned courses:", error.response?.data || error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Fetch Bought Courses for the User
module.exports.buyerCourses = async (req, res) => {
    try {
        console.log("buyerCourses called");
        const token = req.header("Authorization"); 
        console.log("Token:", token); // Debugging line
        if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

        const response = await axios.get(`${USER_SERVICE_URL}/verify-token`, {
            headers: { Authorization: token }
        });
        console.log("Token verified:", response.data); // Debugging line
        
        const userResponse = await axios.get(`${USER_SERVICE_URL}/sendcoursebuyerid`, {
            headers: { Authorization: token },
        });
        console.log("userResponse:", userResponse.data); // Debugging line
        const { userId, buyCourseIds } = userResponse.data;

        if (!buyCourseIds || buyCourseIds.length === 0) {
            return res.status(400).json({ message: "No bought course IDs provided" });
        }

        // Fetch bought course details from DB
        const courses = await Course.find({ _id: { $in: buyCourseIds } });

        res.json({ userId, courses });
    } catch (error) {
        console.error("❌ Error fetching bought courses:", error.response?.data || error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};