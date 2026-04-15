import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white dark:bg-gray-900">
      <div className="max-w-sm w-full text-center p-8 border border-slate-200 dark:border-gray-700 rounded-xl bg-slate-50/50 dark:bg-gray-800/50">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Page Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
          Sorry, the page you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors duration-200 shadow-md"
        >
          ← Go Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
