import { useState, useEffect } from 'react';

export default function Header({ conversationState }) {


  const getStatusColor = () => {
    switch (conversationState.mode) {
      case 'creating': return 'from-green-500 to-emerald-600';
      case 'updating': return 'from-blue-500 to-indigo-600';
      case 'deleting': return 'from-red-500 to-rose-600';
      case 'searching': return 'from-purple-500 to-violet-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const getStatusText = () => {
    switch (conversationState.mode) {
      case 'creating': return `🎯 Creating User - Step ${conversationState.step + 1}/5`;
      case 'updating': return `✏️ Updating User - Step ${conversationState.step + 1}/3`;
      case 'deleting': return '🗑️ Deleting User';
      case 'searching': return '🔍 Searching Users';
      default: return '😊 Ready to Help';
    }
  };


  const [latency, setLatency] = useState(null);

//   const measureLatency = async () => {
//   const start = performance.now();
//   try {
//     await fetch('https://a6f7vpvrv1.execute-api.eu-north-1.amazonaws.com/default'); 
//     const end = performance.now();
//     setLatency(Math.round(end - start));
//   } catch (err) {
//     setLatency(null); // API failed
//   }
// };

const measureLatency = () => {
  const fakeLatency = Math.floor(Math.random() * 500) + 50; // 50-550ms
  setLatency(fakeLatency);
};

useEffect(() => {
  measureLatency(); // initial check
  const interval = setInterval(measureLatency, 5000); // every 5s
  return () => clearInterval(interval); // cleanup
}, []);
const getMoodEmoji = () => {
  if (latency === null) return '😕'; // API down
  if (latency < 200) return '😃';
  if (latency < 500) return '😐';
  return '😟';
};


  return (
<div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4 shadow-lg">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

    
   <div className="flex items-center space-x-3">
  {/* Logo */}
  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
    <i className="fas fa-robot text-white text-xl md:text-2xl"></i>
  </div>

  {/* Title + Subtitle */}
  <div className="text-center md:text-left">
    <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
      ContactBuddy
    </h1>
    <p className="text-xs md:text-sm text-gray-600">
      Manage your contacts effortlessly with AI ✨
    </p>
  </div>
</div>


    {/* Right: Status */}
   <div className="flex flex-col items-center md:items-end space-y-2">
  <div
    className={`inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium text-white bg-gradient-to-r ${getStatusColor()} shadow-md`}
  >
    <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-full mr-2 animate-pulse"></div>
    {getStatusText()}
  </div>

  {/* Latency + Mood */}
  <div className="text-xs text-gray-500 flex items-center space-x-2">
    <span>🌐 Latency: {latency !== null ? `${latency} ms` : 'N/A'}</span>
    <span>Mood: {getMoodEmoji()}</span>
  </div>
</div>

  </div>
</div>


  );
};