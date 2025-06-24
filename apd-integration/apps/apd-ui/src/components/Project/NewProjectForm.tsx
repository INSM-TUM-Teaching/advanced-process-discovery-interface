import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/hooks/useProjectStore';

const NewProjectForm: React.FC = () => {
  const [projectName, setProjectName] = useState('');
  const [modelsCount, setModelsCount] = useState(1);
  const { setProject } = useProjectStore();
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!projectName.trim()) return alert('Project name required');
    setProject({
      name: projectName,
      modelsCount,
      logs: Array(modelsCount).fill(null),
      endpoints: [{activity: "http://localhost:8081/algo", structure: "http://localhost:8082/algo"}],
      thresholds: Array(modelsCount).fill(null),
      compare: false,
    });
    navigate('/project/setup');
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-100 p-8 rounded-xl shadow">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="first_project, etc.."
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 bg-white"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of event logs
          </label>
          <select
            value={modelsCount}
            onChange={(e) => setModelsCount(parseInt(e.target.value))}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 bg-white"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button 
            className="bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-teal-400 transition"
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProjectForm;