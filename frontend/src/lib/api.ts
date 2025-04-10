import { toast } from "@/lib/toast";
import { Course } from "./types";
import { apiClient } from "./apiClient";

// Mock data for courses (in a real app, this would come from the backend)
const initialCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Web Development",
    details: "Learn the basics of HTML, CSS and JavaScript to build beautiful websites.",
    category: "Web Development",
    available: true,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
  },
  {
    id: "2",
    title: "Advanced React Patterns",
    details: "Deep dive into React patterns, hooks, and performance optimization techniques.",
    category: "JavaScript",
    available: true,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
  },
  {
    id: "3",
    title: "Node.js Microservices",
    details: "Learn how to build scalable microservices with Node.js and Express.",
    category: "Backend",
    available: true,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
  },
  {
    id: "4",
    title: "UI/UX Design Fundamentals",
    details: "Master the principles of design to create beautiful and functional user interfaces.",
    category: "Design",
    available: false,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    id: "5",
    title: "Cloud Infrastructure with AWS",
    details: "Deploy and manage applications on Amazon Web Services.",
    category: "DevOps",
    available: true,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
  },
  {
    id: "6",
    title: "Machine Learning Fundamentals",
    details: "Introduction to machine learning algorithms and applications.",
    category: "Data Science",
    available: true,
    image: "https://images.unsplash.com/photo-1527576539890-dfa815648363"
  }
];

// Simulated local storage for our courses
let coursesData: Course[] = [...initialCourses];

// Simulate network delay for mock API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const getAllCourses = async (): Promise<Course[]> => {
  try {
    // In a real app with a backend API:
    // return await apiClient.get<Course[]>('courses');
    
    // For our mock implementation:
    await delay(600);
    return [...coursesData];
  } catch (error) {
    console.error("Error fetching courses:", error);
    toast.error("Failed to load courses");
    return [];
  }
};

export const getCourseById = async (id: string): Promise<Course | undefined> => {
  try {
    // In a real app with a backend API:
    // return await apiClient.get<Course>(`courses/${id}`);
    
    // For our mock implementation:
    await delay(300);
    return coursesData.find(course => course.id === id);
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error);
    toast.error("Failed to load course details");
    return undefined;
  }
};

export const createCourse = async (course: Omit<Course, "id">): Promise<Course> => {
  try {
    // Validate course data
    if (!course.title?.trim()) {
      throw new Error("Course title is required");
    }
    
    // In a real app with a backend API:
    // return await apiClient.post<Course>('courses', course);
    
    // For our mock implementation:
    await delay(800);
    const newCourse = {
      ...course,
      id: Math.random().toString(36).substring(2, 9)
    };
    
    coursesData = [...coursesData, newCourse];
    toast.success("Course created successfully");
    return newCourse;
  } catch (error) {
    console.error("Error creating course:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create course";
    toast.error(errorMessage);
    throw error;
  }
};

export const updateCourse = async (id: string, courseUpdate: Partial<Course>): Promise<Course> => {
  try {
    // Validate course data
    if (courseUpdate.title !== undefined && !courseUpdate.title.trim()) {
      throw new Error("Course title cannot be empty");
    }
    
    // In a real app with a backend API:
    // return await apiClient.put<Course>(`courses/${id}`, courseUpdate);
    
    // For our mock implementation:
    await delay(800);
    
    const courseIndex = coursesData.findIndex(course => course.id === id);
    
    if (courseIndex === -1) {
      toast.error("Course not found");
      throw new Error("Course not found");
    }
    
    const updatedCourse = {
      ...coursesData[courseIndex],
      ...courseUpdate
    };
    
    coursesData[courseIndex] = updatedCourse;
    toast.success("Course updated successfully");
    
    return updatedCourse;
  } catch (error) {
    console.error(`Error updating course ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update course";
    toast.error(errorMessage);
    throw error;
  }
};

export const deleteCourse = async (id: string): Promise<void> => {
  try {
    // In a real app with a backend API:
    // await apiClient.delete(`courses/${id}`);
    
    // For our mock implementation:
    await delay(600);
    
    const initialLength = coursesData.length;
    coursesData = coursesData.filter(course => course.id !== id);
    
    if (coursesData.length === initialLength) {
      toast.error("Course not found");
      throw new Error("Course not found");
    }
    
    toast.success("Course deleted successfully");
  } catch (error) {
    console.error(`Error deleting course ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete course";
    toast.error(errorMessage);
    throw error;
  }
};

// Auth methods - these will now just delegate to our auth module
// We're keeping these to maintain backward compatibility with existing code
export const login = authLogin;
export const logout = authLogout;
export const getCurrentUser = getUser;

import { login as authLogin, logout as authLogout, getUser } from "./auth";
