import React from "react";

interface ClassificationResultProps {
  result: string;
  matchedRules?: string[];
}

const getRecommendation = (result: string) => {
  const lower = result.toLowerCase();
  if (lower === "structured") {
    return {
      language: "BPMN",
      reason: "The imperative BPMN (Business Process Model and Notation) language is ideal for structured event logs because it clearly defines well-ordered processes using standardized flow elements.",
    };
  } else if (lower === "semi-structured" || lower === "semistructured") {
    return {
      language: "fCM",
      reason: "fCM is suitable for semi-structured event logs, capturing causal relationships in partially-defined processes where some control flow exists but is not strictly enforced.",
    };
  } else if (lower === "looselystructured" || lower === "unstructured" || lower === "loosely-structured") {
    return {
      language: "Declare",
      reason: "Declare is recommended for loosely-structured or unstructured logs because it models flexible, constraint-based behavior without assuming a rigid process flow.",
    };
  } else {
    return null;
  }
};

const Classification: React.FC<ClassificationResultProps> = ({ result, matchedRules }) => {
  if (!result) return null;

  const recommendation = getRecommendation(result);

  return (
    <div className="max-w-5xl mx-auto mt-12 p-10 rounded-2xl bg-white shadow-xl border border-gray-200">
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

      {matchedRules && matchedRules.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <p className="text-sm text-red-700 font-medium mb-2">Reason (matched rules):</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {matchedRules.map((rule, index) => (
              <li key={index} className="pl-1">{rule}</li>
            ))}
          </ul>

          <div className="mt-4">
            <img
              src="../../rules.jpg"
              alt="Diagram explaining rule meaning"
              className="rounded-md border shadow max-w-full h-auto"
            />
            <p className="text-xs text-gray-500 text-center mt-2">
              Diagram illustrating the logic behind matched rules
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classification;