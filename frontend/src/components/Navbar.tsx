import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsAuthenticated(false);
        navigate("/login");
        return;
      }
  
      const response = await fetch(import.meta.env.VITE_LOGOUT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        navigate("/login");
      } else {
        console.error("Logout failed:", await response.json());
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  

  return (
    <nav className="bg-gray-600 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div className="flex items-center py-4 px-2">
              <span 
                className="font-semibold text-white text-lg cursor-pointer hover:text-blue-200 transition duration-300"
                onClick={() => navigate("/courses")}
              >
                Course Platform
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className="py-4 px-2 text-white font-semibold hover:text-blue-200 transition duration-300"
            >
              Home
            </Link>
            <Link 
              to="/buy" 
              className="py-4 px-2 text-white font-semibold hover:text-blue-200 transition duration-300"
            >
              Buy
            </Link>
            <Link 
              to="/owner" 
              className="py-4 px-2 text-white font-semibold hover:text-blue-200 transition duration-300"
            >
              Owner
            </Link>
            <Link 
              to="/add" 
              className="py-4 px-2 text-white font-semibold hover:text-blue-200 transition duration-300"
            >
              Add Course
            </Link>
            
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="py-2 px-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition duration-300 ml-2"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="py-2 px-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition duration-300 ml-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;