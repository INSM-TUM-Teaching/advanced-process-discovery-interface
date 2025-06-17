import { equal } from 'assert';
import React, { useState, useEffect } from 'react';

type ModelOption = 'BPMN' | 'Declare' | 'fCM';

interface ModelStepSelectorProps {
  classificationResult: String;
  onContinue: (selectedModel: ModelOption) => void;
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

const ModelStepSelector: React.FC<ModelStepSelectorProps> = ({ classificationResult, onContinue }) => {
  const recommended = getRecommendedModel(classificationResult);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(recommended);
  const [loadedFile, setLoadedFile] = useState<null | { fileType: string; content: string }>(null);
  const [continuePressed, setContinuePressed] = useState<boolean>(false);

  useEffect(() => {
    fetch('/assets/diagram.bpmn')
      .then(res => res.text())
      .then(xml => {
        setLoadedFile({ fileType: 'bpmn', content: xml });
      })
      .catch(err => {
        console.error('Error loading BPMN file:', err);
      });
  }, []);


  return (
    <>
    {continuePressed ? (

    )
      
    }
    </>
  );
};

export default ModelStepSelector;