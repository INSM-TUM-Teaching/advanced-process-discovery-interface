import React, { useEffect } from 'react';
import type { EndpointPair } from '@/types/project-types';
import { useProjectStore } from '@/hooks/useProjectStore';
import { UploadIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Thresholds } from '@/types/matrix-types';

const ConfigureProject: React.FC = () => {
  const { project, updateProject } = useProjectStore();
  const navigate = useNavigate();

  if (!project) return <p className="text-center mt-12">No project found</p>;

  useEffect(() => {

    if (project && project.endpoints.length === 0) {
      updateProject({ endpoints: [{ activity: '', structure: '', declare: ''}] });
    }
  }, [project, updateProject]);

  const { modelsCount } = project;

  const handleLogChange = (file: File | null, fileName: string | undefined, index: number) => {
    const updatedLogs = [...project.logs];
    updatedLogs[index] = { log: file!, name: fileName! };
    updateProject({ logs: updatedLogs });
  };

  const handleThresholdChange = (index: number, key: keyof Thresholds, value: number) => {
    const updated = project.thresholds.map((t, idx) =>
      idx === index ? { ...t, [key]: value } : t
    );
    updateProject({ thresholds: updated });
  };

  const handleEndpointChange = (
    index: number,
    key: keyof EndpointPair,
    value: string
  ) => {
    const updated = [...project.endpoints];
    updated[index][key] = value;
    updateProject({ endpoints: updated });
  };

  const toggleCompare = () => {
    const newCompare = !project.compare;
    const total = newCompare ? modelsCount : 1;
    const updated = Array(total)
      .fill(null)
      .map((_, i) => project.endpoints[i] || { activity: '', structure: '' });
    updateProject({ compare: newCompare, endpoints: updated });
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12">
      <div className="w-full max-w-2xl bg-gray-100 p-8 rounded-xl shadow space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Upload Event Logs</h2>
          <div className="space-y-3">
            {project.logs.map((_, i) => (
              <div key={i}>
                <label
                  htmlFor={`log-upload-${i}`}
                  className="flex items-center gap-3 w-full cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  <UploadIcon className="w-5 h-5 text-gray-500" />
                  {project.logs[i]?.name || 'Choose Event Log'}
                </label>
                <input
                  id={`log-upload-${i}`}
                  type="file"
                  accept=".xes"
                  onChange={(e) => handleLogChange(e.target.files?.[0] || null, e.target.files?.[0].name, i)}
                  className="hidden"
                />
                <div className="flex my-2 items-center gap-3 flex-wrap">
                  <div className="relative group">
                    <label
                      htmlFor={`log-temporal-threshold-${i}`}
                      className="px-2 cursor-pointer rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700"
                    >
                      Temporal threshold
                    </label>
                    <div className="absolute left-0 mt-1 hidden w-64 text-sm text-gray-600 bg-white border border-gray-300 rounded-md shadow-lg p-2 group-hover:block z-10">
                      A value like <strong>0.7</strong> means the temporal dependency is true in 70% of all traces.
                    </div>
                  </div>
                  <input
                    id={`log-temporal-threshold-${i}`}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue={1}
                    onChange={(e) =>
                      handleThresholdChange(i, "temporal_threshold", Number(e.target.value))
                    }
                  />

                  <div className="relative group">
                    <label
                      htmlFor={`log-existential-threshold-${i}`}
                      className="px-2 cursor-pointer rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700"
                    >
                      Existential threshold
                    </label>
                    <div className="absolute left-0 mt-1 hidden w-64 text-sm text-gray-600 bg-white border border-gray-300 rounded-md shadow-lg p-2 group-hover:block z-10">
                      A value like <strong>0.7</strong> means the existential dependency is true in 70% of all traces.
                    </div>
                  </div>
                  <input
                    id={`log-existential-threshold-${i}`}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue={1}
                    onChange={(e) =>
                      handleThresholdChange(i, "existential_threshold", Number(e.target.value))
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="compare"
            type="checkbox"
            checked={project.compare}
            onChange={toggleCompare}
            className="w-5 h-5 text-primary"
          />
          <label htmlFor="compare" className="text-sm font-medium text-gray-700">
            Compare multiple algorithms
          </label>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Configure Algorithm Endpoints</h2>
          <div className="space-y-6">
            {project.endpoints.map((pair, i) => (
              <div key={i} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Activity relationships endpoint {project.compare ? `(Log ${i + 1})` : ''}
                  </label>
                  <input
                    type="url"
                    defaultValue={window.location.protocol+"//"+window.location.hostname+":8081"+"/algo"}
                    onChange={(e) =>
                      handleEndpointChange(i, 'activity', e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-md border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Structuredness classification endpoint {project.compare ? `(Log ${i + 1})` : ''}
                  </label>
                  <input
                    type="url"
                    defaultValue={window.location.protocol+"//"+window.location.hostname+":8082"+"/algo"}
                    onChange={(e) =>
                      handleEndpointChange(i, 'structure', e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-md border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Event log to declare endpoint {project.compare ? `(Log ${i + 1})` : ''}
                  </label>
                  <input
                    type="url"
                    defaultValue={window.location.protocol+"//"+window.location.hostname+":8083"+"/algo"}
                    onChange={(e) =>
                      handleEndpointChange(i, 'declare', e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-md border border-gray-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate('/project/run')}
          className="w-full bg-indigo-700 hover:bg-teal-400 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ConfigureProject;