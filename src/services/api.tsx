import axios from 'axios';
import mockApi from './mockApi';

// Use different API URLs for development vs production
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3001'  // Local development
  : null; // Production will use mock API

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// In production, use mock API instead of axios
if (import.meta.env.PROD) {
  // Override axios with mock API for production
  const mockApiWrapper = {
    get: (url: string) => {
      if (url.includes('/users')) {
        const query = url.includes('?') ? url.split('?')[1] : undefined;
        return mockApi.getUsers(query);
      } else if (url.includes('/shoppingLists')) {
        const query = url.includes('?') ? url.split('?')[1] : undefined;
        return mockApi.getShoppingLists(query);
      } else if (url.includes('/items')) {
        const query = url.includes('?') ? url.split('?')[1] : undefined;
        return mockApi.getItems(query);
      }
      return Promise.reject(new Error('Endpoint not found'));
    },
    post: (url: string, data: any) => {
      if (url.includes('/users')) {
        return mockApi.createUser(data);
      } else if (url.includes('/shoppingLists')) {
        return mockApi.createShoppingList(data);
      } else if (url.includes('/items')) {
        return mockApi.createItem(data);
      }
      return Promise.reject(new Error('Endpoint not found'));
    },
    put: (url: string, data: any) => {
      const id = url.split('/').pop();
      if (url.includes('/users/')) {
        return mockApi.updateUser(id!, data);
      } else if (url.includes('/shoppingLists/')) {
        return mockApi.updateShoppingList(id!, data);
      } else if (url.includes('/items/')) {
        return mockApi.updateItem(id!, data);
      }
      return Promise.reject(new Error('Endpoint not found'));
    },
    delete: (url: string) => {
      const id = url.split('/').pop();
      if (url.includes('/shoppingLists/')) {
        return mockApi.deleteShoppingList(id!);
      } else if (url.includes('/items/')) {
        return mockApi.deleteItem(id!);
      }
      return Promise.reject(new Error('Endpoint not found'));
    }
  };
  
  // Replace the default export with mock API wrapper
  Object.assign(api, mockApiWrapper);
}

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 404) {
      console.error('API endpoint not found:', error.config?.url);
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.message);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Cannot connect to JSON server. Make sure it\'s running on port 3001');
    }
    
    return Promise.reject(error);
  }
);

export default api;