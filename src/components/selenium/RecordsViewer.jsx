import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, Eye, Filter } from 'lucide-react';
import { apiService } from '../../services/selenium'
import ProductCard from '../selenium/ProductCard'
import LoadingSpinner from './LoadingSpinner'
import toast from 'react-hot-toast';

const RecordsViewer = ({ refreshTrigger }) => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [limit, setLimit] = useState(9);
  const [skip, setSkip] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const result = await apiService.getRecords(skip, limit);
      setRecords(result.data || []);
      setTotalCount(result.count || 0);
    } catch (error) {
      console.error('Failed to fetch records:', error);
      toast.error('Failed to load records');
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [skip, limit, refreshTrigger]);

  const handleRefresh = () => {
    setSkip(0);
    fetchRecords();
    toast.success('Records refreshed!');
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20 relative overflow-hidden mx-2 sm:mx-0">
      {/* Background */}
      <div className="absolute top-0 left-0 w-24 sm:w-40 h-24 sm:h-40 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full -translate-y-12 sm:-translate-y-20 -translate-x-12 sm:-translate-x-20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-tl from-purple-400/10 to-pink-400/10 rounded-full translate-y-10 sm:translate-y-16 translate-x-10 sm:translate-x-16 blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex justify-center sm:justify-start">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl shadow-xl">
                <Database className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-800 mb-1 sm:mb-2">View Records</h2>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Browse scraped products from database</p>
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
          >
            <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0 lg:space-x-6 mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl border border-blue-200/50">
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
              <Filter className="inline w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-blue-600" />
              Records per page
            </label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setSkip(0);
              }}
              className="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-medium bg-white/80 backdrop-blur-sm text-sm sm:text-base"
            >
              <option value={10}>10 records</option>
              <option value={25}>25 records</option>
              <option value={50}>50 records</option>
              <option value={100}>100 records</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm font-medium">
            <div className="px-3 sm:px-4 py-2 bg-white/80 rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
              <span className="text-gray-600">Showing {skip + 1}-{Math.min(skip + limit, skip + totalCount)} of {skip + totalCount} records</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading records..." />
        ) : records.length > 0 ? (
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {records.map((record, index) => (
                <ProductCard key={record._id || index} product={record} />
              ))}
            </div>

            {/* Mobile-Optimized Pagination */}
        <div className="flex flex-row items-center justify-center gap-4 pt-6 sm:pt-8">
  <button
    onClick={() => setSkip(Math.max(0, skip - limit))}
    disabled={skip === 0}
    
    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[50px] flex items-center justify-center"
  >
    <i className="fas fa-chevron-left"></i>
  </button>

  <div className="px-3 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold shadow-lg text-sm sm:text-base min-w-[80px] text-center">
    Page {Math.floor(skip / limit) + 1}
  </div>

  <button
    onClick={() => setSkip(skip + limit)}
    disabled={totalCount < limit}
className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[50px] flex items-center justify-center"
  >
    <i className="fas fa-chevron-right"></i>
  </button>
</div>

          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Eye className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-600 mb-3 sm:mb-4">No Records Found</h3>
            <p className="text-gray-500 text-base sm:text-lg max-w-md mx-auto leading-relaxed px-4">
              Start by scraping some products to see them here. Your scraped data will appear in beautiful cards like magic!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordsViewer;