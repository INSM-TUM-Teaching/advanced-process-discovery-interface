import React, { useState, useEffect } from 'react';
import { BpmnModeler } from 'bpmn-condec-modeler';

type ModelOption = 'BPMN' | 'Declare' | 'fCM';

interface ModelStepSelectorProps {
  classificationResult: String;
}

const getRecommendedModel = (classification: String): ModelOption => {
  switch (classification.toLowerCase()) {
    case "structured":
      return 'BPMN';
    case "semi structured":
      return 'fCM';
    case "loosely structured":
    case 'unstructured':
      return 'Declare';
    default:
      return 'BPMN';
  }
};

const ModelStepSelector: React.FC<ModelStepSelectorProps> = ({ classificationResult }) => {
  const recommended = getRecommendedModel(classificationResult);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(recommended);
  const [loadedFile, setLoadedFile] = useState<null | { fileType: string; content: string }>(null);
  const [continuePressed, setContinuePressed] = useState<boolean>(false);

  useEffect(() => {
    fetch('/diagram.bpmn')
      .then(res => res.text())
      .then(xml => {
        console.log('Fetched BPMN XML:', xml);
        setLoadedFile({ fileType: 'bpmn', content: xml });
      })
      .catch(err => {
        console.error('Error loading BPMN file:', err);
      });
  }, []);

  return (
    <>
      {continuePressed ? (
        selectedModel === 'BPMN' && loadedFile ? (
          <BpmnModeler loadedFile={loadedFile} />
        ) : (
          <div className="text-center p-6">
            <h2 className="text-lg font-semibold mb-4">
              You selected: {selectedModel}
            </h2>
            <p>
              Modeler for <strong>{selectedModel}</strong> is not implemented yet.
            </p>
          </div>
        )
      ) : (
        <div className="max-w-md mx-auto p-6 border rounded-xl shadow space-y-6 bg-white">
          <h2 className="text-lg font-semibold text-center">
            Recommended modeling language based on classification:{' '}
            <span className="text-blue-600 font-bold">{recommended}</span>
          </h2>
  
          <form className="space-y-4">
            {(['BPMN', 'Declare', 'fCM'] as ModelOption[]).map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="model"
                  value={option}
                  checked={selectedModel === option}
                  onChange={() => setSelectedModel(option)}
                  className="accent-blue-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </form>
  
          <div className="text-center">
            <button
              onClick={() => setContinuePressed(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModelStepSelector;