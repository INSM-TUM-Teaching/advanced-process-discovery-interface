import React from "react";

interface ClassificationResultProps {
  result: string;
  failedRule?: string;
}

const Classification: React.FC<ClassificationResultProps> = ({ result, failedRule }) => {
  if (!result) return null;

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 rounded-xl bg-white shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Classification Result</h2>
      <p className="text-indigo-700 text-xl whitespace-pre-wrap mb-4">{result}</p>
      {failedRule && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <p className="text-sm text-red-700 font-medium">Reason:</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{failedRule}</p>
        </div>
      )}
    </div>
  );
};

export default Classification;