import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface MockTask {
  id: number;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignee?: string;
  project?: string;
  due_date?: string;
  created_at: string;
}

interface MockProject {
  id: number;
  name: string;
}

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<MockTask[]>([]);
  const [projects] = useState<MockProject[]>([
    { id: 1, name: 'Workline Development' },
    { id: 2, name: 'Client Portal' },
    { id: 3, name: 'Mobile App' },
  ]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    project: '',
    search: '',
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'To Do' as 'To Do' | 'In Progress' | 'Done',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Urgent',
    project: '',
    due_date: '',
  });

  useEffect(() => {
    // Initialize with mock data
    const mockTasks: MockTask[] = [
      {
        id: 1,
        title: 'Setup project repository',
        description: 'Initialize Git repository and setup CI/CD pipeline for automated testing and deployment',
        status: 'Done',
        priority: 'High',
        assignee: 'John Doe',
        project: 'Workline Development',
        created_at: '2024-01-01T10:00:00Z'
      },
      {
        id: 2,
        title: 'Design user interface',
        description: 'Create wireframes and mockups for the dashboard, including mobile responsive design',
        status: 'In Progress',
        priority: 'Medium',
        assignee: 'Jane Smith',
        project: 'Workline Development',
        due_date: '2024-01-15',
        created_at: '2024-01-02T14:30:00Z'
      },
      {
        id: 3,
        title: 'Implement authentication',
        description: 'Add login and signup functionality with JWT tokens and role-based access control',
        status: 'To Do',
        priority: 'High',
        assignee: user?.name || 'Unassigned',
        project: 'Workline Development',
        due_date: '2024-01-10',
        created_at: '2024-01-03T09:15:00Z'
      },
      {
        id: 4,
        title: 'Write documentation',
        description: 'Create comprehensive user manual and API documentation',
        status: 'To Do',
        priority: 'Low',
        assignee: 'Alex Johnson',
        project: 'Workline Development',
        due_date: '2024-01-20',
        created_at: '2024-01-04T11:45:00Z'
      },
      {
        id: 5,
        title: 'Setup database',
        description: 'Configure database schema, migrations, and backup procedures',
        status: 'Done',
        priority: 'Urgent',
        assignee: 'Mike Wilson',
        project: 'Workline Development',
        created_at: '2024-01-01T08:00:00Z'
      },
      {
        id: 6,
        title: 'Mobile app wireframes',
        description: 'Design mobile app interface and user experience flow',
        status: 'In Progress',
        priority: 'Medium',
        assignee: 'Sarah Davis',
        project: 'Mobile App',
        due_date: '2024-01-18',
        created_at: '2024-01-05T13:20:00Z'
      },
      {
        id: 7,
        title: 'Client feedback review',
        description: 'Review and implement client feedback from portal testing phase',
        status: 'To Do',
        priority: 'High',
        assignee: 'Tom Brown',
        project: 'Client Portal',
        due_date: '2024-01-12',
        created_at: '2024-01-06T16:00:00Z'
      }
    ];
    setTasks(mockTasks);
  }, [user?.name]);

  const filteredTasks = tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.project && task.project !== filters.project) return false;
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !task.description?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTaskObj: MockTask = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      priority: newTask.priority,
      assignee: user?.name || 'Unassigned',
      project: newTask.project || undefined,
      due_date: newTask.due_date || undefined,
      created_at: new Date().toISOString(),
    };
    
    setTasks([...tasks, newTaskObj]);
    setNewTask({
      title: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      project: '',
      due_date: '',
    });
    setShowCreateForm(false);
  };

  const handleUpdateTask = (taskId: number, updates: Partial<MockTask>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleDeleteTask = (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600 bg-red-50';
      case 'High': return 'text-orange-600 bg-orange-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage and track your tasks • Demo Mode</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div>
            <select
              value={filters.project}
              onChange={(e) => setFilters({ ...filters, project: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => {
          const overdue = task.due_date && isOverdue(task.due_date);
          
          return (
            <div key={task.id} className={`bg-white rounded-lg shadow p-6 border-l-4 ${
              overdue ? 'border-red-500' : 'border-blue-500'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{task.title}</h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-gray-400 hover:text-red-600"
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">{task.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                
                {task.assignee && (
                  <div className="text-xs text-gray-500">
                    👤 {task.assignee}
                  </div>
                )}
                
                {task.project && (
                  <div className="text-xs text-gray-500">
                    📁 {task.project}
                  </div>
                )}
                
                {task.due_date && (
                  <div className={`text-xs ${overdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    📅 Due: {new Date(task.due_date).toLocaleDateString()}
                    {overdue && ' (Overdue)'}
                  </div>
                )}
              </div>
              
              {/* Quick Status Update */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <select
                  value={task.status}
                  onChange={(e) => handleUpdateTask(task.id, { status: e.target.value as any })}
                  className="w-full text-xs p-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
          );
        })}
        
        {filteredTasks.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">
              {Object.values(filters).some(filter => filter) 
                ? 'Try adjusting your filters' 
                : 'Create your first task to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project
                  </label>
                  <select
                    value={newTask.project}
                    onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.name}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
