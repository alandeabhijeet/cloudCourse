const express = require("express");
const { getCourses , getCourseById ,buyCourse , createCourse , updateCourse , deleteCourse , buyerCourses , ownerCourses} = require("../controllers/courseControllers");
const router = express.Router();

router.get("/items", getCourses ); // no 
router.get("/item/:id", getCourseById); // no 


router.post("/item", createCourse); // login
// router.post("/item/:id", buyCourse); 

router.put("/item/:id",updateCourse);
router.delete("/item/:id", deleteCourse); 

router.get("/items/buy", buyerCourses); 
router.get("/items/owner", ownerCourses); 

module.exports = router;
