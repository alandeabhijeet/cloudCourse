
import { toast } from "./toast";
import config from "./config";
import { getToken } from "./auth";

// Common HTTP error types
type HttpErrorType = 'network' | 'server' | 'unauthorized' | 'forbidden' | 'not-found' | 'validation' | 'unknown';

// Custom error class
class ApiError extends Error {
  status: number;
  type: HttpErrorType;
  details?: any;

  constructor(message: string, status: number, type: HttpErrorType, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.type = type;
    this.details = details;
  }
}

// Input validation
const validateInput = (data: any): boolean => {
  // Check for potential XSS in strings
  if (typeof data === 'string') {
    // Very basic XSS check - in a real app, use a proper library
    const xssPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    if (xssPattern.test(data)) {
      toast.error("Invalid input detected");
      return false;
    }
  } else if (typeof data === 'object' && data !== null) {
    // Recursively check all properties
    for (const key in data) {
      if (!validateInput(data[key])) {
        return false;
      }
    }
  }
  return true;
};

// API client with security features
const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      // Add auth token if available
      const token = getToken();
      const headers = new Headers(options.headers);
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      // Set default headers
      if (!headers.has('Content-Type') && options.method !== 'GET') {
        headers.set('Content-Type', 'application/json');
      }
      
      // Add security headers
      headers.set('X-Requested-With', 'XMLHttpRequest');
      
      // Validate request body if present
      if (options.body && typeof options.body === 'string') {
        try {
          const data = JSON.parse(options.body);
          if (!validateInput(data)) {
            throw new ApiError('Invalid input data', 400, 'validation');
          }
        } catch (e) {
          if (e instanceof ApiError) throw e;
          throw new ApiError('Invalid request data', 400, 'validation');
        }
      }
      
      // Make the request
      const url = `${config.apiUrl}/${endpoint}`.replace(/\/+/g, '/');
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Send cookies for sessions
      });
      
      // Handle different status codes
      if (!response.ok) {
        let errorType: HttpErrorType = 'unknown';
        let errorDetails;
        
        switch (response.status) {
          case 401:
            errorType = 'unauthorized';
            break;
          case 403:
            errorType = 'forbidden';
            break;
          case 404:
            errorType = 'not-found';
            break;
          case 400:
          case 422:
            errorType = 'validation';
            try {
              errorDetails = await response.json();
            } catch (e) {
              // If parsing fails, continue without details
            }
            break;
          case 500:
            errorType = 'server';
            break;
          default:
            errorType = 'unknown';
        }
        
        throw new ApiError(
          response.statusText || `Error ${response.status}`,
          response.status,
          errorType,
          errorDetails
        );
      }
      
      // Parse response
      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiError('Network error', 0, 'network');
      }
      
      throw new ApiError('Unknown error', 0, 'unknown');
    }
  },
  
  // Convenience methods
  async get<T>(endpoint: string, options: Omit<RequestInit, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },
  
  async post<T>(endpoint: string, data: any, options: Omit<RequestInit, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async put<T>(endpoint: string, data: any, options: Omit<RequestInit, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  async delete<T>(endpoint: string, options: Omit<RequestInit, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};

export { apiClient, ApiError };
