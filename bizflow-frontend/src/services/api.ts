import axios, { AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignee_id?: number;
  project_id?: number;
  due_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  created_at: string;
  updated_at?: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  category?: string;
  description?: string;
  unit_cost?: number;
  created_at: string;
  updated_at?: string;
}

export interface InventoryTransaction {
  id: number;
  item_id: number;
  transaction_type: 'in' | 'out';
  quantity: number;
  reason?: string;
  notes?: string;
  created_at: string;
}

export interface TimeEntry {
  id: number;
  user_id: number;
  task_id?: number;
  project_id?: number;
  hours: number;
  description?: string;
  date: string;
  created_at: string;
}

export interface FinancialRecord {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category?: string;
  date: string;
  user_id: number;
  task_id?: number;
  project_id?: number;
  created_at: string;
}

export interface AccountingEntry {
  id: number;
  transaction_type: 'expense' | 'revenue';
  amount: number;
  description: string;
  category?: string;
  date: string;
  task_id?: number;
  project_id?: number;
  created_at: string;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      formData.append('grant_type', 'password');
      
      console.log('Attempting login for:', email);
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 10000,
      });
      
      console.log('Login successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      
      // Provide better error messages
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      } else {
        throw new Error(error.response?.data?.detail || 'Login failed. Please try again.');
      }
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/users/');
    return response.data;
  },

  getUser: async (userId: number): Promise<User> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  createUser: async (userData: any): Promise<User> => {
    const response = await api.post('/users/', userData);
    return response.data;
  },

  updateUser: async (userId: number, userData: any): Promise<User> => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/users/${userId}`);
  },
};

// Tasks API
export const tasksAPI = {
  getTasks: async (params?: {
    skip?: number;
    limit?: number;
    assignee_id?: number;
    project_id?: number;
    status?: string;
  }): Promise<Task[]> => {
    const response = await api.get('/tasks/', { params });
    return response.data;
  },

  getTask: async (taskId: number): Promise<Task> => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  createTask: async (taskData: any): Promise<Task> => {
    const response = await api.post('/tasks/', taskData);
    return response.data;
  },

  updateTask: async (taskId: number, taskData: any): Promise<Task> => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (taskId: number): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },
};

// Projects API
export const projectsAPI = {
  getProjects: async (skip: number = 0, limit: number = 20): Promise<Project[]> => {
    const response = await api.get('/projects/', { params: { skip, limit } });
    return response.data;
  },

  getProject: async (projectId: number): Promise<Project> => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },

  createProject: async (projectData: any): Promise<Project> => {
    const response = await api.post('/projects/', projectData);
    return response.data;
  },

  updateProject: async (projectId: number, projectData: any): Promise<Project> => {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
  },

  deleteProject: async (projectId: number): Promise<void> => {
    await api.delete(`/projects/${projectId}`);
  },

  getProjectTasks: async (projectId: number): Promise<Task[]> => {
    const response = await api.get(`/projects/${projectId}/tasks`);
    return response.data;
  },

  createProjectTask: async (projectId: number, taskData: any): Promise<Task> => {
    const response = await api.post(`/projects/${projectId}/tasks`, taskData);
    return response.data;
  },

  getProjectProgress: async (projectId: number): Promise<any> => {
    const response = await api.get(`/projects/${projectId}/progress`);
    return response.data;
  },
};

// Inventory API
export const inventoryAPI = {
  getItems: async (): Promise<InventoryItem[]> => {
    const response = await api.get('/inventory/items/');
    return response.data;
  },

  getItem: async (itemId: number): Promise<InventoryItem> => {
    const response = await api.get(`/inventory/items/${itemId}`);
    return response.data;
  },

  createItem: async (itemData: any): Promise<InventoryItem> => {
    const response = await api.post('/inventory/items/', itemData);
    return response.data;
  },

  updateItem: async (itemId: number, itemData: any): Promise<InventoryItem> => {
    const response = await api.put(`/inventory/items/${itemId}`, itemData);
    return response.data;
  },

  deleteItem: async (itemId: number): Promise<void> => {
    await api.delete(`/inventory/items/${itemId}`);
  },

  getTransactions: async (): Promise<InventoryTransaction[]> => {
    const response = await api.get('/inventory/transactions/');
    return response.data;
  },

  createTransaction: async (transactionData: any): Promise<InventoryTransaction> => {
    const response = await api.post('/inventory/transactions/', transactionData);
    return response.data;
  },

  getLowStockItems: async (threshold: number = 10): Promise<InventoryItem[]> => {
    const response = await api.get('/inventory/low-stock/', { params: { threshold } });
    return response.data;
  },
};

// Time Tracking API
export const timeAPI = {
  getTimeEntries: async (params?: {
    skip?: number;
    limit?: number;
    user_id?: number;
    task_id?: number;
    project_id?: number;
  }): Promise<TimeEntry[]> => {
    const response = await api.get('/time/', { params });
    return response.data;
  },

  getTimeEntry: async (entryId: number): Promise<TimeEntry> => {
    const response = await api.get(`/time/${entryId}`);
    return response.data;
  },

  createTimeEntry: async (entryData: any): Promise<TimeEntry> => {
    const response = await api.post('/time/', entryData);
    return response.data;
  },

  updateTimeEntry: async (entryId: number, entryData: any): Promise<TimeEntry> => {
    const response = await api.put(`/time/${entryId}`, entryData);
    return response.data;
  },

  deleteTimeEntry: async (entryId: number): Promise<void> => {
    await api.delete(`/time/${entryId}`);
  },
};

// Financial Records API
export const financialAPI = {
  getRecords: async (): Promise<FinancialRecord[]> => {
    const response = await api.get('/financial-records/');
    return response.data;
  },

  getRecord: async (recordId: number): Promise<FinancialRecord> => {
    const response = await api.get(`/financial-records/${recordId}`);
    return response.data;
  },

  createRecord: async (recordData: any): Promise<FinancialRecord> => {
    const response = await api.post('/financial-records/', recordData);
    return response.data;
  },

  updateRecord: async (recordId: number, recordData: any): Promise<FinancialRecord> => {
    const response = await api.put(`/financial-records/${recordId}`, recordData);
    return response.data;
  },

  deleteRecord: async (recordId: number): Promise<void> => {
    await api.delete(`/financial-records/${recordId}`);
  },
};

// Accounting API
export const accountingAPI = {
  getEntries: async (): Promise<AccountingEntry[]> => {
    const response = await api.get('/accounting/');
    return response.data;
  },

  getEntry: async (entryId: number): Promise<AccountingEntry> => {
    const response = await api.get(`/accounting/${entryId}`);
    return response.data;
  },

  createEntry: async (entryData: any): Promise<AccountingEntry> => {
    const response = await api.post('/accounting/', entryData);
    return response.data;
  },

  updateEntry: async (entryId: number, entryData: any): Promise<AccountingEntry> => {
    const response = await api.put(`/accounting/${entryId}`, entryData);
    return response.data;
  },

  deleteEntry: async (entryId: number): Promise<void> => {
    await api.delete(`/accounting/${entryId}`);
  },

  getSummary: async (): Promise<any> => {
    const response = await api.get('/accounting/summary');
    return response.data;
  },
};

// Reporting API
export const reportingAPI = {
  getTaskStats: async (): Promise<any> => {
    const response = await api.get('/reports/task-stats');
    return response.data;
  },

  getTimeStats: async (): Promise<any> => {
    const response = await api.get('/reports/time-stats');
    return response.data;
  },

  getFinancialSummary: async (): Promise<any> => {
    const response = await api.get('/reports/financial-summary');
    return response.data;
  },

  getInventoryStats: async (): Promise<any> => {
    const response = await api.get('/reports/inventory-stats');
    return response.data;
  },
};

export default api;
