import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-6">
        {/* Outer spinning ring */}
        <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
        {/* Inner spinning element */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
        {/* Glowing effect */}
        <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-20 animate-pulse"></div>
      </div>
      <p className="text-gray-700 text-lg font-semibold animate-pulse">{message}</p>
      <div className="flex space-x-1 mt-4">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;