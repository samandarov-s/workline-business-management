import React, { useState, useEffect } from 'react';
import { projectsAPI, tasksAPI, Project, Task } from '../services/api';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'active',
    start_date: '',
    end_date: '',
    budget: '',
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsAPI.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectTasks = async (projectId: number) => {
    try {
      const tasks = await projectsAPI.getProjectTasks(projectId);
      setProjectTasks(tasks);
    } catch (error) {
      console.error('Error loading project tasks:', error);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        ...newProject,
        budget: newProject.budget ? parseFloat(newProject.budget) : undefined,
      };
      await projectsAPI.createProject(projectData);
      setNewProject({
        name: '',
        description: '',
        status: 'active',
        start_date: '',
        end_date: '',
        budget: '',
      });
      setShowCreateForm(false);
      loadProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const selectProject = (project: Project) => {
    setSelectedProject(project);
    loadProjectTasks(project.id);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'To Do': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage and track your projects</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">All Projects</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => selectProject(project)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedProject?.id === project.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p>No projects found</p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="mt-2 text-blue-600 hover:text-blue-800"
                  >
                    Create your first project
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="lg:col-span-2">
          {selectedProject ? (
            <div className="space-y-6">
              {/* Project Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedProject.name}</h2>
                    <p className="text-gray-600 mt-1">{selectedProject.description}</p>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Start Date</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedProject.start_date ? new Date(selectedProject.start_date).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">End Date</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedProject.end_date ? new Date(selectedProject.end_date).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Budget</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedProject.budget ? `$${selectedProject.budget.toLocaleString()}` : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Project Tasks */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Project Tasks</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {projectTasks.map((task) => (
                    <div key={task.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTaskStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              Priority: {task.priority}
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
                  {projectTasks.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      <p>No tasks found for this project</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-gray-500">
                <div className="text-4xl mb-4">📁</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Project</h3>
                <p>Choose a project from the list to view details and tasks</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newProject.start_date}
                    onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newProject.end_date}
                    onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget
                </label>
                <input
                  type="number"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                />
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
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects; 