
import config from "./config";
import { toast } from "./toast";

// Types
interface AuthToken {
  token: string;
  expires: number;
}

interface User {
  id: string;
  username: string;
  name: string;
  roles?: string[];
}

// Token handling with expiration
const saveToken = (token: string): void => {
  const expires = new Date().getTime() + config.sessionTimeout;
  const tokenData: AuthToken = { token, expires };
  sessionStorage.setItem(config.authTokenKey, JSON.stringify(tokenData));
};

const getToken = (): string | null => {
  const tokenJson = sessionStorage.getItem(config.authTokenKey);
  if (!tokenJson) return null;
  
  try {
    const tokenData: AuthToken = JSON.parse(tokenJson);
    const now = new Date().getTime();
    
    // Check if token has expired
    if (now > tokenData.expires) {
      sessionStorage.removeItem(config.authTokenKey);
      return null;
    }
    
    return tokenData.token;
  } catch (e) {
    console.error("Error parsing auth token", e);
    sessionStorage.removeItem(config.authTokenKey);
    return null;
  }
};

// User management
const saveUser = (user: User): void => {
  sessionStorage.setItem("user", JSON.stringify(user));
};

const getUser = (): User | null => {
  const userJson = sessionStorage.getItem("user");
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (e) {
    console.error("Error parsing user data", e);
    return null;
  }
};

// Auth operations
const login = async (username: string, password: string): Promise<{ success: boolean, message?: string }> => {
  // Validate inputs
  if (!username || !username.trim()) {
    return { success: false, message: "Username is required" };
  }
  
  if (!password || password.length < 6) {
    return { success: false, message: "Password must be at least 6 characters" };
  }
  
  try {
    // For demo purposes - in real app, this would call a secure API endpoint
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, accept any non-empty username/password with minimum validation
    if (username && password) {
      // Generate a mock token (in a real app this would come from the server)
      const mockToken = `demo_${Math.random().toString(36).substring(2)}`;
      saveToken(mockToken);
      
      // Save user info
      const userData: User = {
        id: "1",
        username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        roles: ["user"]
      };
      saveUser(userData);
      
      return { success: true };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};

const logout = (): void => {
  sessionStorage.removeItem(config.authTokenKey);
  sessionStorage.removeItem("user");
};

// Role-based authorization
const hasRole = (requiredRole: string): boolean => {
  const user = getUser();
  return user?.roles?.includes(requiredRole) || false;
};

// Check if user is authenticated
const isAuthenticated = (): boolean => {
  return !!getToken() && !!getUser();
};

export {
  login,
  logout,
  getUser,
  getToken,
  hasRole,
  isAuthenticated
};
