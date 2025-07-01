import React, { useState, useEffect } from 'react';
import { BpmnModeler } from 'bpmn-condec-modeler';
import type { Matrix } from '@/types/matrix-types';
import { fetchDeclareFromMatrix } from '@/services/declare-api';

type ModelOption = 'BPMN' | 'Declare' | 'fCM';

interface ModelStepSelectorProps {
  classificationResult: String;
  matrix: Matrix;
}

const getRecommendedModel = (classification: String): ModelOption => {
  switch (classification.toLowerCase()) {
    case "structured":
      return 'BPMN';
    case "semi-structured":
      return 'fCM';
    case "loosely structured":
    case 'unstructured':
      return 'Declare';
    default:
      return 'BPMN';
  }
};

const ModelStepSelector: React.FC<ModelStepSelectorProps> = ({ classificationResult, matrix }) => {
  const recommended = getRecommendedModel(classificationResult);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(recommended);
  const [loadedFile, setLoadedFile] = useState<null | { fileType: string; content: string }>(null);
  const [declareJson, setDeclareJson] = useState<string>("");

  const fetchDeclare = async (matrix: Matrix) => {
    const results = await fetchDeclareFromMatrix(new URL("http://localhost:8083/algo"), matrix);
    setDeclareJson(JSON.stringify(results, null, 2));
  };

  useEffect(() => {
    fetch('/diagram.bpmn')
      .then(res => res.text())
      .then(xml => {
        setLoadedFile({ fileType: 'bpmn', content: xml });
      })
      .catch(err => {
        console.error('Error loading BPMN file:', err);
      });

    fetchDeclare(matrix);
  }, [matrix]);

  const renderModel = () => {
    switch (selectedModel) {
      case 'BPMN':
        return loadedFile ? (
          <div className="h-[65vh] w-full overflow-hidden flex flex-col bg-white shadow rounded-md">
            <BpmnModeler loadedFile={loadedFile} />
          </div>
        ) : (
          <p className="text-center">Loading BPMN model...</p>
        );
      case 'Declare':
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">Declare Model (JSON)</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {declareJson ? declareJson : "Loading Declare model..."}
            </pre>
          </div>
        );
      case 'fCM':
        return (
          <div className="text-center p-6">
            <h2 className="text-lg font-semibold mb-4">You selected: fCM</h2>
            <p>Modeler for <strong>fCM</strong> is not implemented yet.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="text-center">
        <h2 className="text-lg font-semibold">
          Recommended modeling language: <span className="text-blue-600 font-bold">{recommended}</span>
        </h2>
        <div className="flex justify-center mt-4 space-x-4">
          {(['BPMN', 'Declare', 'fCM'] as ModelOption[]).map((option) => (
            <button
              key={option}
              onClick={() => setSelectedModel(option)}
              className={`px-4 py-2 rounded-md border ${
                selectedModel === option ? 'bg-indigo-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {option}{option === recommended ? ' (Recommended)' : ''}
            </button>
          ))}
        </div>
      </div>

      {renderModel()}
    </div>
  );
};

export default ModelStepSelector;