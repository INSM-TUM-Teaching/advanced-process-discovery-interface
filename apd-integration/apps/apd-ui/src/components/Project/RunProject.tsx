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
import { Link } from 'react-router-dom';

const RunProject: React.FC = () => {
  const { project, updateProject } = useProjectStore();
  const [step, setStep] = useState<Step>('matrix');
  const [matrixResults, setMatrixResults] = useState<any[]>([]);
  const [classificationResults, setClassificationResults] = useState<any[]>([]);
  const [visibleLogs, setVisibleLogs] = useState<boolean[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (project?.logs) {
      setVisibleLogs(project.logs.map(() => true));
    }
  }, [project]);

  const handleThresholdChange = (index: number, key: keyof Thresholds, value: number) => {
    if (!project) return;
    const updated = project.thresholds.map((t, idx) =>
      idx === index ? { ...t, [key]: value } : t
    );
    updateProject({ thresholds: updated });
  };

  useEffect(() => {
    if (!project) return;

    const fetchClassificationFromMatrixResult = async (matrix: Matrix) => {
      const results = await fetchClassificationFromMatrix(new URL(project.endpoints[0].structure + "/matrix"), matrix);
      setClassificationResults([results]);
    };

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
      const results = await Promise.all(
        project.logs.map((log, i) => {
          const endpoint = project.compare ? project.endpoints[i]?.structure : project.endpoints[0]?.structure;
          if (!log || !endpoint) return null;
          return fetchClassification(new URL(endpoint), log.log, project.thresholds[i]);
        })
      );
      setClassificationResults(results);
    };

    fetchMatrixData();
    fetchClassificationResult();
  }, [project]);

  if (!project) return <p className="text-center mt-12">No project loaded</p>;

  const visibleIndexes = project.logs.map((_, i) => i).filter(i => visibleLogs[i]);

  const renderGridItem = (i: number, isFullWidth: boolean = false) => (
    <div
      key={i}
      className={`bg-white shadow-md p-6 ${isFullWidth ? 'col-span-2' : ''}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="font-semibold text-lg">Log {i + 1}: {project.logs[i].name}</h3>

        {step === 'matrix' && (
          <>
            <button
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-700 text-white text-sm font-medium rounded-md hover:bg-teal-400 transition"
              onClick={() => downloadYAML(matrixResults[i], project.logs[i].name)}
            >
              Download matrix
            </button>

            <div className="flex flex-wrap gap-3 items-center">
              <label htmlFor={`log-temporal-threshold-${i}`} className="text-sm text-gray-700">
                Temporal:
              </label>
              <input
                id={`log-temporal-threshold-${i}`}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                type="number"
                min="0"
                max="1"
                step="any"
                defaultValue={project.thresholds[i].temporal_threshold}
                onChange={(e) => handleThresholdChange(i, 'temporal_threshold', Number(e.target.value))}
              />
              <label htmlFor={`log-existential-threshold-${i}`} className="text-sm text-gray-700">
                Existential:
              </label>
              <input
                id={`log-existential-threshold-${i}`}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                type="number"
                min="0"
                max="1"
                step="any"
                defaultValue={project.thresholds[i].existential_threshold}
                onChange={(e) => handleThresholdChange(i, 'existential_threshold', Number(e.target.value))}
              />
            </div>
          </>
        )}
      </div>

      {step === 'matrix' && matrixResults[i] ? (
        <MatrixTable matrix={matrixResults[i]} />
      ) : step === 'classification' && classificationResults[i] ? (
        <Classification result={classificationResults[i]} failedRule="ss1" />
      ) : step === 'model' && classificationResults[i] ? (
        <ModelStepSelector classificationResult={classificationResults[i]} matrix={matrixResults[i]} />
      ) : (
        <p className="text-gray-500">Loading {step}...</p>
      )}
    </div>
  );

  const renderGrid = () => {
    const count = visibleIndexes.length;
    if (count === 0) return <p className="text-gray-400">No logs selected</p>;

    if (count === 1) {
      return <div className="grid grid-cols-1">{renderGridItem(visibleIndexes[0], true)}</div>;
    }

    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-6">
          {visibleIndexes.map((i) => renderGridItem(i))}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="grid grid-cols-2 gap-6 auto-rows-auto">
          {renderGridItem(visibleIndexes[0])}
          {renderGridItem(visibleIndexes[1])}
          {renderGridItem(visibleIndexes[2], true)}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-6">
        {visibleIndexes.map((i) => renderGridItem(i))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-100">
      <div className="flex items-center gap-4">
        {['matrix', 'classification', 'model'].map((s) => (
          <button
            key={s}
            onClick={() => setStep(s as Step)}
            className={`px-4 py-2 rounded-md ${step === s ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}

        <div className="mx-8 relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            View
          </button>

          <Link to="/">
            <button
              className="px-4 mx-2 py-2 bg-gray-200 rounded-md"
            >
              Home
            </button>
          </Link>

          {dropdownOpen && (
            <div className="absolute z-10 mt-2 w-48 bg-white border rounded-md shadow-md p-2">
              {project.logs.map((log, i) => (
                <label key={i} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleLogs[i]}
                    onChange={() =>
                      setVisibleLogs((prev) => {
                        const newVis = [...prev];
                        newVis[i] = !newVis[i];
                        return newVis;
                      })
                    }
                  />
                  <span className="text-md text-gray-700">Log {i + 1}: {log.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {renderGrid()}
    </div>
  );
};

export default RunProject;