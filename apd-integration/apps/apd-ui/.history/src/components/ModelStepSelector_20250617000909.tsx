import React, { useState } from 'react';

type ClassificationType = 'structured' | 'semi_structured' | 'loosely_structured' | 'unstructured';
type ModelOption = 'BPMN' | 'Declare' | 'fCM';

interface ModelStepSelectorProps {
  classificationResult: ClassificationType;
  onContinue: (selectedModel: ModelOption) => void;
}

const getRecommendedModel = (classification: ClassificationType): ModelOption => {
  switch (classification) {
    case 'structured':
      return 'BPMN';
    case 'semi_structured':
      return 'fCM';
    case 'loosely_structured':
    case 'unstructured':
      return 'Declare';
    default:
      return 'BPMN';
  }
};

const ModelStepSelector: React.FC<ModelStepSelectorProps> = ({ classificationResult, onContinue }) => {
  const recommended = getRecommendedModel(classificationResult);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(recommended);

  return (
    <div className="max-w-md mx-auto p-6 border rounded-xl shadow space-y-6 bg-white">
      <h2 className="text-lg font-semibold text-center">
        Recommended modeling language:{' '}
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
          onClick={() => onContinue(selectedModel)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ModelStepSelector;