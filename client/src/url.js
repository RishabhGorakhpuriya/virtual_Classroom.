

// Define and export base URLs for your application
export const API_BASE_URL = 'http://localhost:3001';
export const AUTH_LOGIN_URL = `${API_BASE_URL}/api/auth/login`;
export const USERS_REGISTOR_URL = `${API_BASE_URL}/api/auth/signup`;
export const CLASS_CREATION = `${API_BASE_URL}/api/createClass`;
export const UPDATE_CREATION = `${API_BASE_URL}/api/updateClassById`;
export const GET_ALLCLASS = `${API_BASE_URL}/api/getClass`;

export const POSTS_URL = `${API_BASE_URL}/posts`;
export const COMMENTS_URL = `${API_BASE_URL}/comments`;

// Optionally, you can define other constants here as needed
export const APP_NAME = 'MyReactApp';
export const APP_VERSION = '1.0.0';

// Export an object that groups related constants together (optional)
export const API_ENDPOINTS = {
  AUTH: AUTH_LOGIN_URL,
  USERS: USERS_REGISTOR_URL,
  CLASS : CLASS_CREATION,
  UPDATE_CLASS: UPDATE_CREATION,
  GET_ALL_CLASS : GET_ALLCLASS,
  POSTS: POSTS_URL,
  COMMENTS: COMMENTS_URL
};
