import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <h1><Link to="/"><img className="w-[80px] h-[50px]" src="../../public/logo-apd-1.png"></img></Link></h1>
      <nav className="space-x-6">
        <Link className="text-gray-900 hover:text-teal-400" to="/project">Project</Link>
        <Link className="text-gray-900 hover:text-teal-400" to="/documentation">Documentation</Link>
        <Link className="text-gray-900 hover:text-teal-400" to="/about">About</Link>
      </nav>
    </header>
  );
};

export default Header;