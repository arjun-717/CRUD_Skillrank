import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { ShoppingCart, Zap, CheckCircle } from 'lucide-react';
import ProductScraper from '../components/selenium/ProductScraper'
import RecordsViewer from '../components/selenium/RecordsViewer'
import { apiService } from '../services/selenium'

function SeleniumPage() {
  const [activeTab, setActiveTab] = useState('scrape');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [apiStatus, setApiStatus] = useState('checking');

  // Check API health on component mount
  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      await apiService.healthCheck();
      setApiStatus('connected');
    } catch (error) {
      setApiStatus('disconnected');
      console.error('API health check failed:', error);
    }
  };

  const handleScrapeComplete = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('records');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#333',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderRadius: '16px',
            padding: '16px 20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      
      <div className="container mx-auto px-4 py-6 sm:py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl">
              <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
              Amazon Scraper
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Powerful AI-driven tool to scrape and analyze Amazon products with real-time data extraction and intelligent insights
          </p>
          
          {/* API Status Indicator */}
          <div className="flex items-center justify-center mt-6">
            <div className={`flex items-center space-x-3 px-6 py-3 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm border transition-all duration-300 ${
              apiStatus === 'connected' 
                ? 'bg-green-100/80 text-green-800 border-green-200 shadow-green-100'
                : apiStatus === 'disconnected'
                ? 'bg-red-100/80 text-red-800 border-red-200 shadow-red-100'
                : 'bg-yellow-100/80 text-yellow-800 border-yellow-200 shadow-yellow-100'
            }`}>
              <CheckCircle className={`w-5 h-5 ${
                apiStatus === 'connected' ? 'text-green-600' : 
                apiStatus === 'disconnected' ? 'text-red-600' : 'text-yellow-600'
              }`} />
              <span>
                API: {apiStatus === 'connected' ? 'Connected' : 
                     apiStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 px-4">
          <div className="bg-white/80 backdrop-blur-lg p-2 rounded-2xl shadow-2xl border border-white/20">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={() => setActiveTab('scrape')}
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-3 min-w-[160px] ${
                  activeTab === 'scrape'
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-xl transform scale-105'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 hover:shadow-lg'
                }`}
              >
                <Zap className="w-5 h-5" />
                <span>Scrape Products</span>
              </button>
              
              <button
                onClick={() => setActiveTab('records')}
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-3 min-w-[160px] ${
                  activeTab === 'records'
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-xl transform scale-105'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 hover:shadow-lg'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>View Records</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'scrape' && (
            <div className="max-w-3xl mx-auto animate-fade-in">
              <ProductScraper onScrapeComplete={handleScrapeComplete} />
            </div>
          )}
          
          {activeTab === 'records' && (
            <div className="animate-fade-in">
              <RecordsViewer refreshTrigger={refreshTrigger} />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default SeleniumPage;