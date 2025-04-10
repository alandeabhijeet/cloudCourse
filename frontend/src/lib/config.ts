
// Configuration values with environment variable fallbacks
// In production, these would be set in the hosting environment

const config = {
  // API related config
  apiUrl: import.meta.env.VITE_API_URL || "/api",
  
  // Authentication related config
  authTokenKey: "auth_token",
  refreshTokenKey: "refresh_token",
  
  // Application settings
  appName: "MyCourses",
  appVersion: import.meta.env.VITE_APP_VERSION || "1.0.0",
  
  // Security settings
  sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || "3600000", 10), // 1 hour in ms
  
  // Feature flags
  features: {
    enableAdvancedFiltering: import.meta.env.VITE_ENABLE_ADVANCED_FILTERING === "true",
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  },
};

export default config;
