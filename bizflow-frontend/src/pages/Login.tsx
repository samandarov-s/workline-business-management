import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [name, setName] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState("");

  const roles = [
    { value: "admin", label: "Admin", description: "Full system access" },
    { value: "manager", label: "Manager", description: "Team and project management" },
    { value: "employee", label: "Employee", description: "Task and time tracking" },
    { value: "accountant", label: "Accountant", description: "Financial management" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    try {
      await login(name, role);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            W
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Welcome to Workline</h2>
          <p className="text-gray-600 mt-2">Enter your details to continue</p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Select Your Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={loading}
            >
              {roles.map((roleOption) => (
                <option key={roleOption.value} value={roleOption.value}>
                  {roleOption.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {roles.find(r => r.value === role)?.description}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? "Logging in..." : "Enter Workline"}
        </button>

        <div className="mt-6 text-center">
          <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
            <p className="font-medium mb-2">🚀 Quick Start</p>
            <p className="mb-1">• Just enter your name and pick a role</p>
            <p className="mb-1">• No passwords needed for now</p>
            <p>• Full authentication coming soon!</p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
            <p className="font-medium mb-1">💡 Try different roles:</p>
            <p><strong>Admin:</strong> See all features</p>
            <p><strong>Manager:</strong> Project management focus</p>
            <p><strong>Employee:</strong> Task and time tracking</p>
            <p><strong>Accountant:</strong> Financial tools</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
