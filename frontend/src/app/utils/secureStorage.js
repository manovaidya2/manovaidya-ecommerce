/**
 * Secure Storage Utility
 * Provides safe methods for localStorage and sessionStorage operations
 * with validation and sanitization
 */

/**
 * Safely set item in localStorage with validation
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be stringified)
 * @returns {boolean} - Success status
 */
export const setLocalStorage = (key, value) => {
  try {
    if (!key || typeof key !== 'string') {
      console.error('Invalid storage key');
      return false;
    }
    
    // Validate value is serializable
    const serialized = JSON.stringify(value);
    
    // Check size (localStorage has ~5-10MB limit)
    if (serialized.length > 5000000) {
      console.error('Data too large for localStorage');
      return false;
    }
    
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('Error setting localStorage:', error);
    return false;
  }
};

/**
 * Safely get item from localStorage with validation
 * @param {string} key - Storage key
 * @returns {any|null} - Parsed value or null
 */
export const getLocalStorage = (key) => {
  try {
    if (!key || typeof key !== 'string') {
      console.error('Invalid storage key');
      return null;
    }
    
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    return JSON.parse(item);
  } catch (error) {
    console.error('Error getting localStorage:', error);
    return null;
  }
};

/**
 * Safely set item in sessionStorage with validation
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be stringified)
 * @returns {boolean} - Success status
 */
export const setSessionStorage = (key, value) => {
  try {
    if (!key || typeof key !== 'string') {
      console.error('Invalid storage key');
      return false;
    }
    
    const serialized = JSON.stringify(value);
    
    if (serialized.length > 5000000) {
      console.error('Data too large for sessionStorage');
      return false;
    }
    
    sessionStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('Error setting sessionStorage:', error);
    return false;
  }
};

/**
 * Safely get item from sessionStorage with validation
 * @param {string} key - Storage key
 * @returns {any|null} - Parsed value or null
 */
export const getSessionStorage = (key) => {
  try {
    if (!key || typeof key !== 'string') {
      console.error('Invalid storage key');
      return null;
    }
    
    const item = sessionStorage.getItem(key);
    if (!item) return null;
    
    return JSON.parse(item);
  } catch (error) {
    console.error('Error getting sessionStorage:', error);
    return null;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Remove item from sessionStorage
 * @param {string} key - Storage key
 */
export const removeSessionStorage = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from sessionStorage:', error);
  }
};

/**
 * Clear all localStorage
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Clear all sessionStorage
 */
export const clearSessionStorage = () => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing sessionStorage:', error);
  }
};
