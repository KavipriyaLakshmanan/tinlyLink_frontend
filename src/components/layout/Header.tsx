import React from 'react';
import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 transition-colors">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
              <Link2 className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold">TinyLink</span>
          </Link>
          
          <nav className="flex space-x-10">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md text-lg font-medium transition-colors border-b-2 border-transparent hover:border-blue-600"
            >
              Dashboard
            </Link>
            <a
              href="#solutions"
              className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md text-lg font-medium transition-colors border-b-2 border-transparent hover:border-blue-600"
            >
              Solutions
            </a>
            <a
              href="#features"
              className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md text-lg font-medium transition-colors border-b-2 border-transparent hover:border-blue-600"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md text-lg font-medium transition-colors border-b-2 border-transparent hover:border-blue-600"
            >
              Pricing
            </a>
          </nav>

          <div className="flex space-x-4">
            <button className="text-blue-600 hover:text-blue-700 px-6 py-2 text-lg font-medium transition-colors">
              Log in
            </button>
            <button className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-2 rounded-lg text-lg font-medium transition-colors shadow-sm">
              Sign up free
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};