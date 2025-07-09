import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <header className="max-w-5xl mx-auto py-12 text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-indigo-700">
          Advanced Process Discovery for BPM
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tool for running advanced process discovery from event logs (.xes), with default algorithms integrated for matrix generation and structuredness classification. Supports custom algorithms through http requests. Allows for up to 4 event logs to be processed and displayed simultanously for comparison, different algorithms can be used for each event log.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/project">
            <button className="bg-indigo-700 hover:bg-indigo-600 text-white px-6 py-3 text-lg rounded-md shadow-md">
              Get Started
            </button>
          </Link>
          <Link to="/documentation">
            <button className="text-indigo-700 border-indigo-700 hover:bg-indigo-100 px-6 py-3 text-lg rounded-md border">
              Documentation
            </button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-20">
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-indigo-600">Activity Relationship Matrix Intermediate Representation</h2>
          <p>
            A matrix which shows the relation between all pair of activities is generated from the raw event log and displayed. Temporal and existential thresholds can be updated live to deal with event log noise.
          </p>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-md border">
          <img src="../../matrix.jpg" alt="Matrix Representation" className="w-full h-auto object-contain" />
        </section>

        <section className="bg-white p-6 rounded-xl shadow-md border order-last md:order-none">
          <img src="../../classification.jpg" alt="Structuredness Classification" className="w-full h-auto object-contain" />
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-indigo-600">Structuredness Classification</h2>
          <p>
            Our algorithm evaluates the structuredness of each event log and maps it along a spectrum. This helps determine the most suitable modeling language—whether it's block-structured, declarative, or hybrid.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Landing;
