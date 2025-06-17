import React, { useEffect, useState } from 'react';
import { useProjectStore } from '@/hooks/useProjectStore';
import MatrixTable from '@/components/MatrixTable';
import { fetchMatrix } from '@/services/matrix-api';
import type { Step } from '@/types/project-types';
import { fetchClassification, fetchClassificationFromMatrix } from '@/services/classification-api';
import Classification from '../Classification';
import { downloadYAML } from '@/services/matrix-yaml';
import type { Matrix, Thresholds } from '@/types/matrix-types';
import ModelStepSelector from '@/components/ModelStepSelector';


const RunProject: React.FC = () => {
  const { project, updateProject } = useProjectStore();
  const [step, setStep] = useState<Step>('matrix');
  const [matrixResults, setMatrixResults] = useState<any[]>([]);
  const [classificationResults, setClassificationResults] = useState<any[]>([]);

  const handleThresholdChange = (index: number, key: keyof Thresholds, value: number) => {
    if (!project) return;
    const updated = project.thresholds.map((t, idx) =>
      idx === index ? { ...t, [key]: value } : t
    );
    updateProject({ thresholds: updated });
  }

  useEffect(() => {
    if (!project) return;

    const fetchClassificationFromMatrixResult = async (matrix: Matrix) => {
      const results = await fetchClassificationFromMatrix(new URL(project.endpoints[0].structure+"/matrix"), matrix);
      setClassificationResults([results]);
    }

    if (project.matrix) {
      setMatrixResults([project.matrix]);
      fetchClassificationFromMatrixResult(project.matrix);
      return;
    }

    const fetchMatrixData = async () => {
      const results = await Promise.all(
        project.logs.map((log, i) => {
          const endpoint = project.compare ? project.endpoints[i]?.activity : project.endpoints[0]?.activity;
          if (!log || !endpoint) return null;
          return fetchMatrix(new URL(endpoint), log.log, project.thresholds[i]);
        })
      );
      setMatrixResults(results);
    };

    const fetchClassificationResult = async () => {
      if (!project) return;
      const results = await Promise.all(
        project.logs.map((log, i) => {
          const endpoint = project.compare ? project.endpoints[i]?.structure : project.endpoints[0]?.structure
          if (!log || !endpoint) return null;
          return fetchClassification(new URL(endpoint), log.log, project.thresholds[i]);
        })
      );
      setClassificationResults(results);
    }

    fetchMatrixData();
    fetchClassificationResult();
  }, [project]);

  if (!project) return <p className="text-center mt-12">No project loaded</p>;

  const { modelsCount } = project;

  const gridCols = modelsCount === 1 ? 'grid-cols-1'
    : modelsCount === 2 ? 'grid-cols-2'
      : modelsCount === 3 ? 'grid-cols-2 grid-rows-2'
        : 'grid-cols-2 grid-rows-2';

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4">
        {['matrix', 'classification', 'model'].map((s) => (
          <button
            key={s}
            onClick={() => setStep(s as Step)}
            className={`px-4 py-2 rounded-md ${step === s ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className={`grid gap-6 ${gridCols}`}>
        {project.logs.map((log, i) => (
          <div key={i} className="border rounded-xl p-4 shadow bg-white">
            <h3 className="font-semibold mb-2">Log {i + 1}: {log.name}</h3>
            {step === 'matrix' && (
              matrixResults[i] ? (
                <div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md hover:bg-teal-400 transition duration-200 my-4" onClick={() => downloadYAML(matrixResults[i], log.name)}>Download matrix</button>
                  <div className="flex my-2">
                    <label
                      htmlFor={`log-temporal-threshold-${i}`}
                      className="items-center gap-3 px-2 mr-2 cursor-pointer rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700"
                    >Temporal threshold :</label>
                    <input
                      id={`log-temporal-threshold-${i}`}
                      className="w-32 px-3 py-2 mr-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      type="number"
                      min="0"
                      max="1"
                      step="any"
                      defaultValue={project.thresholds[i].temporal_threshold}
                      onChange={(e) => {handleThresholdChange(i,"temporal_threshold",Number(e.target.value))}}
                    />
                    <label
                      htmlFor={`log-existential-threshold-${i}`}
                      className="items-center gap-3 px-2 mr-2 cursor-pointer rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700"
                    >Existential threshold :</label>
                    <input
                      id={`log-existential-threshold-${i}`}
                      className="w-32 px-3 py-2 mr-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      type="number"
                      min="0"
                      max="1"
                      step="any"
                      defaultValue={project.thresholds[i].existential_threshold}
                      onChange={(e) => {handleThresholdChange(i,"existential_threshold",Number(e.target.value))}}
                    />
                  </div>
                  <MatrixTable matrix={matrixResults[i]} />
                </div>
              ) : (
                <p className="text-gray-500">Loading matrix...</p>
              )
            )}
            {step === 'classification' && (
              classificationResults[i] ? (
                <Classification result={classificationResults[i]} failedRule="ss1"></Classification>
              ) : (
                <p className="text-gray-500">Loading classification...</p>
              )
            )}
            {step === 'model' && (
              classificationResults[i] ? (
                <ModelStepSelector classificationResult={classificationResults[i]} onContinue={() => console.log("Test")}></ModelStepSelector>
              ) : (
                <p className="text-gray-400 italic">Step "{step}" not implemented yet.</p>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RunProject;