import React from 'react';

const Documentation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <header className="max-w-4xl mx-auto py-12 text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-indigo-700">Custom Algorithm API Guide</h1>
        <p className="text-lg text-gray-600">
          Integrate your own discovery and classification logic into this tool by providing compatible endpoints.
        </p>
      </header>

      <main className="max-w-4xl mx-auto space-y-16">

        <section>
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">1. Activity Relationship Matrix Endpoint</h2>
          <p className="mb-4">
            This endpoint receives a <strong>.xes event log file</strong> and two thresholds. It should return a matrix with a list of activities and their dependencies.
          </p>

          <h3 className="font-semibold text-lg mb-2">Expected Request</h3>
          <p className="mb-2">`POST multipart/form-data` with:</p>
          <ul className="list-disc list-inside mb-4">
            <li><code>file</code>: the event log (.xes)</li>
            <li><code>existential_threshold</code>: float (0–1)</li>
            <li><code>temporal_threshold</code>: float (0–1)</li>
          </ul>

          <h3 className="font-semibold text-lg mb-2">Expected Response (JSON)</h3>
          <h3 className="font-semibold text-lg mb-2">NOTE: The existential "type" field should be first letter capital, and in case of two words no spaces and first letter of each word capital. Ex: "NegatedEquivalence". For direction just "Forward" or "Backward" should be used. Temporal "type" is either "Direct" or "Eventual".</h3>
          <pre className="bg-white rounded-md p-4 shadow text-sm overflow-auto">
            {`{
  "activities": ["A", "B", "C"],
  "matrix": [
    [
      {
        "dependency": {
          "from": "A",
          "to": "B",
          "existential_dependency": {
            "type": "NegatedEquivalence",
            "direction": "Forward"
          },
          "temporal_dependency": {
            "type": "Eventual",
            "direction": "Backward"
          }
        }
      },
      ...
    ]
  ]
}`}
          </pre>

          <h3 className="font-semibold text-lg mt-6 mb-2">React Type Definitions (for further clarification)</h3>
          <pre className="bg-white rounded-md p-4 shadow text-sm overflow-auto">
            {`type DependencyType = {
  type: string,
  direction: string
};

type Dependency = {
  from: string,
  to: string,
  existential_dependency: DependencyType,
  temporal_dependency: DependencyType
};

type Matrix = {
  activities: string[],
  dependencies: Dependency[]
};`}
          </pre>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">2. Process Classification Endpoint</h2>
          <p className="mb-4">
            You should set up two types of endpoints for classification:
          </p>

          <h3 className="font-semibold text-lg mb-2">Classification from Event Log</h3>
          <p className="mb-2">`POST multipart/form-data` with:</p>
          <ul className="list-disc list-inside mb-4">
            <li><code>file</code>: the event log (.xes)</li>
            <li><code>existential_threshold</code>: float</li>
            <li><code>temporal_threshold</code>: float</li>
          </ul>

          <h4 className="font-medium mb-2">Expected Response (JSON)</h4>
          <h4 className="font-semibold mb-4">NOTE: all responses outside of structured, semi-structured (or semi structured) and loosely-structured will be classified as unstructured</h4>
        
          <pre className="bg-white rounded-md p-4 shadow text-sm overflow-auto">
            {`"semi-structured"`}
          </pre>

          <h3 className="font-semibold text-lg mt-6 mb-2">Classification from Matrix</h3>
          <p className="mb-2">Endpoint should be the same as the classification from event log + "/matrix". Ex: if endpoint for classification from event log is `http://localhost:3000/algo` then the matrix endpoint should be `http://localhost:3000/algo/matrix`</p>
          <p className="mb-2">`POST application/json` with:</p>

          <h4 className="font-medium mb-2">Matrix Format</h4>
          <pre className="bg-white rounded-md p-4 shadow text-sm overflow-auto">
            {`{
  "dependencies": [
    {
      "key": ["A", "B"],
      "value": {
        "from": "A",
        "to": "B",
        "existential_dependency": {
          "type": "Implication",
          "direction": "Backward"
        },
        "temporal_dependency": {
          "type": "Direct",
          "direction": "Forward"
        }
      }
    }
  ]
}`}
          </pre>

          <h4 className="font-medium mb-2 mt-4">Response (JSON)</h4>
          <pre className="bg-white rounded-md p-4 shadow text-sm overflow-auto">
            {`"semi-structured"`}
          </pre>

          <h3 className="font-semibold text-lg mt-6 mb-2">Helper Type: MatrixRust (not tied to Rust specifically, but this type is used for sending the matrix to the /matrix classification endpoint)</h3>
          <pre className="bg-white rounded-md p-4 shadow text-sm overflow-auto">
            {`type MatrixRust = {
  dependencies: {
    key: [string, string],
    value: Dependency
  }[]
};`}
          </pre>
        </section>
      </main>
    </div>
  );
};

export default Documentation;