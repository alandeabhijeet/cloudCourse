import React, { useState } from "react";
import axios from "axios";

const Add: React.FC = () => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("development");
  const [available, setAvailable] = useState(true);

  const handleAddCourse = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("User not authenticated");
      return;
    }

    try {
      const courseResponse = await axios.post(
        import.meta.env.VITE_ITEM,
        { title, details, category, available },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Course added successfully");
    } catch (error) {
      console.error("Error adding course:", error.response?.data || error.message);
      alert("Failed to add course");
    }
  };

  return (
    <div className="mt-8 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Course</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Title</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Details</label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Course Details"
          rows={4}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Category</label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="development">Development</option>
          <option value="ai">AI</option>
          <option value="cloud">Cloud</option>
          <option value="electronics">Electronics</option>
        </select>
      </div>

      <div className="mb-6 flex items-center">
        <input
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={available}
          onChange={(e) => setAvailable(e.target.checked)}
        />
        <label className="ml-2 text-gray-700">Available</label>
      </div>

      <button
        onClick={handleAddCourse}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
      >
        Add Course
      </button>
    </div>
  );
};

export default Add;