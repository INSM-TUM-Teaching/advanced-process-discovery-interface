import React from "react";

interface ClassificationResultProps {
  result: string;
}

const Classification: React.FC<ClassificationResultProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 rounded-xl bg-white shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Classification Result</h2>
      <p className="text-indigo-700 text-xl whitespace-pre-wrap">{result}</p>
    </div>
  );
};

export default Classification;