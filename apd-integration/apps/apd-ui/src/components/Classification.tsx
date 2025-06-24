import React from "react";

interface ClassificationResultProps {
  result: string;
  failedRule?: string;
}

const getRecommendation = (result: string) => {
  const lower = result.toLowerCase();
  if (lower === "structured") {
    return {
      language: "BPMN",
      reason: "BPMN (Business Process Model and Notation) is ideal for structured event logs because it clearly defines well-ordered, rule-based processes using standardized flow elements.",
    };
  } else if (lower === "semi-structured") {
    return {
      language: "fCM",
      reason: "fCM is suitable for semi-structured event logs, capturing causal relationships in partially-defined processes where some control flow exists but is not strictly enforced.",
    };
  } else if (lower === "loosely structured" || lower === "unstructured") {
    return {
      language: "Declare",
      reason: "Declare is recommended for loosely-structured or unstructured logs because it models flexible, constraint-based behavior without assuming a rigid process flow.",
    };
  } else {
    return null;
  }
};

const Classification: React.FC<ClassificationResultProps> = ({ result, failedRule }) => {
  if (!result) return null;

  const recommendation = getRecommendation(result);

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 rounded-xl bg-white shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Classification Result</h2>
      <p className="text-indigo-700 text-xl whitespace-pre-wrap mb-4">{result}</p>

      {recommendation && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-4">
          <p className="text-sm text-blue-700 font-medium">
            Recommended Modeling Language: <span className="font-semibold">{recommendation.language}</span>
          </p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap mt-1">{recommendation.reason}</p>
        </div>
      )}

      {failedRule && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <p className="text-sm text-red-700 font-medium">Reason (rule):</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{failedRule}</p>
        </div>
      )}
    </div>
  );
};

export default Classification;