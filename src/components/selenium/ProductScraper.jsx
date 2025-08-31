import React, { useState } from 'react';
import { Search, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/selenium'
import LoadingSpinner from '../selenium/LoadingSpinner'
import toast from 'react-hot-toast';

const ProductScraper = ({ onScrapeComplete }) => {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const handleScrape = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a product name to search');
      return;
    }

    if (limit < 1 || limit > 200) {
      toast.error('Limit must be between 1 and 200');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await apiService.scrapeProducts(query.trim(), limit);
      toast.success(`Successfully scraped ${result.total_scraped} products!`);
      onScrapeComplete?.(result);
    } catch (error) {
      console.error('Scraping failed:', error);
      toast.error(
        error.response?.data?.detail || 
        error.response?.data?.error || 
        'Failed to scrape products. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20 relative overflow-hidden mx-2 sm:mx-0">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full -translate-y-10 sm:-translate-y-16 translate-x-10 sm:translate-x-16 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-tr from-pink-400/10 to-purple-400/10 rounded-full translate-y-8 sm:translate-y-12 -translate-x-8 sm:-translate-x-12 blur-2xl"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4 mb-6 sm:mb-8">
          <div className="flex items-center justify-center">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-xl">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-800 mb-1 sm:mb-2">Scrape Products</h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Search and scrape products from Amazon with AI precision</p>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Scraping products from Amazon..." />
        ) : (
          <form onSubmit={handleScrape} className="space-y-6 sm:space-y-8">
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., iPhone 15, laptop, headphones..."
                className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-base sm:text-lg font-medium bg-white/80 backdrop-blur-sm placeholder-gray-400"
                required
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 px-1 sm:px-2">
                Enter the product you want to search for on Amazon
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                Number of Products (1-200)
              </label>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                min="1"
                max="200"
                className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-base sm:text-lg font-medium bg-white/80 backdrop-blur-sm"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 px-1 sm:px-2">
                How many products do you want to scrape?
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex justify-center sm:justify-start flex-shrink-0">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="text-xs sm:text-sm text-blue-800">
                  <p className="font-bold mb-2 sm:mb-3 text-sm sm:text-base">How it works:</p>
                  <ul className="space-y-1.5 sm:space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 font-bold text-sm sm:text-base">•</span>
                      <span>We'll search Amazon India for your product</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-500 font-bold text-sm sm:text-base">•</span>
                      <span>Extract product details, prices, and ratings</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-pink-500 font-bold text-sm sm:text-base">•</span>
                      <span>Save results to database (duplicates will be updated)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-indigo-500 font-bold text-sm sm:text-base">•</span>
                      <span>Process typically takes 30-60 seconds</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base sm:text-lg"
            >
              <Package className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Start Scraping</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductScraper;