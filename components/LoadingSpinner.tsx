import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-brand-500 mx-auto" />
        <p className="mt-4 text-lg font-medium text-gray-700">Loading your dealership data...</p>
        <p className="mt-2 text-sm text-gray-500">Please wait while we fetch your vehicles and expenses</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;