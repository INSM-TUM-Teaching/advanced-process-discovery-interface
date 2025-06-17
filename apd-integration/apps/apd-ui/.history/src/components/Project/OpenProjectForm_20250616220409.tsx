import React from 'react';
import { useState } from 'react';
import { UploadIcon } from 'lucide-react';
import yaml from 'js-yaml';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/hooks/useProjectStore';
import type { Matrix } from '@/types/matrix-types';

const OpenProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { updateProject } = useProjectStore();
  const [pendingMatrix, setPendingMatrix] = useState<Matrix | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [endpoint, setEndpoint] = useState("");
  const [fileName, setFileName] = useState<string>("");

  function normalizeDependency(dep: any): any {
    const isNone = (val: any) => typeof val === 'string' && val.toLowerCase() === 'none';
  
    return {
      ...dep,
      temporal_dependency: isNone(dep.temporal_dependency?.type)
        ? null
        : dep.temporal_dependency,
      existential_dependency: isNone(dep.existential_dependency?.type)
        ? null
        : dep.existential_dependency,
    };
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.apd')) {
      console.log('Uploaded APD project:', file);
    } else if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
      const text = await file.text();
      try {
        const parsed = yaml.load(text) as Matrix;
        if (parsed.activities && parsed.dependencies) {
          parsed.dependencies = parsed.dependencies.map(normalizeDependency);
          setPendingMatrix(parsed);
          setShowDialog(true);
          setFileName(file.name);
        } else {
          alert('Invalid matrix structure in YAML.');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to parse YAML.');
      }
    } else {
      alert('Please upload a valid .apd or .yaml file.');
    }
  };

  const confirmEndpoint = () => {

    if (!pendingMatrix) {
      alert("Matrix not valid");
      return;
    }

    updateProject({
      logs: [{log: new File([], ""), name: fileName}],
      compare: false,
      endpoints: [{ activity: "",  structure: endpoint}],
      matrix: pendingMatrix,
      modelsCount: 1,
      thresholds: [{existential_threshold: 1, temporal_threshold: 1}]
    });
    navigate('/project/run');
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-100 p-8 rounded-xl shadow">
        <div className="mb-6">
          <label className="block mb-4 font-medium">Upload your .apd or .yaml file</label>
          <label
            htmlFor="project"
            className="flex items-center gap-3 w-full cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            <UploadIcon className="w-5 h-5 text-gray-500" />
            Choose project
          </label>
          <input
            id="project"
            type="file"
            accept=".apd,.yaml,.yml"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-100 p-6 rounded shadow-md w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Enter Structuredness Endpoint</h2>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 hover:text-black"
                onClick={() => {
                  setShowDialog(false);
                  setPendingMatrix(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={confirmEndpoint}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenProjectForm;