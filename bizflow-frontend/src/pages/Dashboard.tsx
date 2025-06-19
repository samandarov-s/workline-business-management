import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalProjects: number;
  lowStockItems: number;
}

interface MockTask {
  id: number;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  due_date?: string;
}

interface MockProject {
  id: number;
  name: string;
  description: string;
  status: string;
  budget?: number;
}

const Dashboard: React.FC = () => {
  const { user, isAdmin, isManager } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    totalProjects: 0,
    lowStockItems: 0,
  });
  const [recentTasks, setRecentTasks] = useState<MockTask[]>([]);
  const [recentProjects, setRecentProjects] = useState<MockProject[]>([]);

  useEffect(() => {
    // Simulate loading data
    const mockTasks: MockTask[] = [
      { id: 1, title: 'Setup project repository', description: 'Initialize Git repository and setup CI/CD', status: 'Done', priority: 'High' },
      { id: 2, title: 'Design user interface', description: 'Create wireframes and mockups for the dashboard', status: 'In Progress', priority: 'Medium', due_date: '2024-01-15' },
      { id: 3, title: 'Implement authentication', description: 'Add login and signup functionality', status: 'To Do', priority: 'High', due_date: '2024-01-10' },
      { id: 4, title: 'Write documentation', description: 'Create user manual and API docs', status: 'To Do', priority: 'Low', due_date: '2024-01-20' },
      { id: 5, title: 'Setup database', description: 'Configure database schema and migrations', status: 'Done', priority: 'Urgent' },
    ];

    const mockProjects: MockProject[] = [
      { id: 1, name: 'Workline Development', description: 'Main project for building the Workline application', status: 'active', budget: 50000 },
      { id: 2, name: 'Client Portal', description: 'Customer-facing portal for project updates', status: 'active', budget: 25000 },
      { id: 3, name: 'Mobile App', description: 'iOS and Android mobile application', status: 'planning', budget: 75000 },
    ];

    // Calculate stats
    const completedTasks = mockTasks.filter(task => task.status === 'Done').length;
    const overdueTasks = mockTasks.filter(task => 
      task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Done'
    ).length;

    setStats({
      totalTasks: mockTasks.length,
      completedTasks,
      overdueTasks,
      totalProjects: mockProjects.length,
      lowStockItems: 3, // Mock low stock items
    });

    setRecentTasks(mockTasks.slice(0, 5));
    setRecentProjects(mockProjects);
  }, []);

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'To Do': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600';
      case 'High': return 'text-orange-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100 mt-1">Here's what's happening in your workspace today.</p>
        <div className="mt-3 text-sm bg-blue-400 bg-opacity-30 rounded px-3 py-1 inline-block">
          Role: {user?.role} • Demo Mode Active
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-2xl">⏰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overdueTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">📁</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Projects</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Tasks</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentTasks.map((task) => (
              <div key={task.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTaskStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.due_date && (
                        <span className="text-xs text-gray-500">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Active Projects</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentProjects.map((project) => (
              <div key={project.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-xs text-gray-500 capitalize">
                        Status: {project.status}
                      </span>
                      {project.budget && (
                        <span className="text-xs text-gray-500">
                          Budget: ${project.budget.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role-specific Sections */}
      {(isAdmin() || isManager()) && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Management Overview</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalTasks}</div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.overdueTasks}</div>
                <div className="text-sm text-gray-600">Overdue Tasks</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Mode Notice */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-blue-400 text-xl">ℹ️</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Demo Mode:</strong> You're viewing sample data. All features are fully functional with mock data. 
              <br />Real backend integration coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
