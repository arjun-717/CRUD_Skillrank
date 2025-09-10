import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaPhone, FaPlus, FaList, FaComments, FaSignOutAlt, FaUser } from "react-icons/fa";

export default function HomePage() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative">
      {/* Header */}
  <header className="sticky top-0 z-[1000] bg-white/50 backdrop-blur-sm shadow-lg border-b border-white/20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center py-3 sm:py-4 px-2 sm:px-4">

      {/* Left: Logo + Title + Greeting */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 sm:p-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <FaPhone className="text-white text-lg sm:text-xl md:text-2xl" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-[clamp(0.9rem,2.5vw,1.6rem)] leading-tight">
            PhoneBook
          </h1>
          {/* Greeting */}
          <span className="text-gray-700 font-medium text-[clamp(0.65rem,1.5vw,1rem)] sm:text-[clamp(0.75rem,1.5vw,1rem)]">
            Welcome, <span className="text-blue-600">{user?.username}</span>
          </span>
        </div>
      </div>

      {/* Right: User Avatar with Dropdown */}
      <div className="flex items-center space-x-3 sm:space-x-5 relative">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center bg-gradient-to-r from-gray-50 to-blue-50 px-2.5 sm:px-4 py-1 sm:py-1.5 
                    rounded-xl shadow-md border border-white/50 cursor-pointer hover:shadow-lg transition-all duration-300"
            aria-label="User menu"
          >
            <div className="bg-blue-100 p-1.5 rounded-full">
              <FaUser className="text-blue-600 text-[clamp(0.9rem,1.5vw,1.2rem)]" />
            </div>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-[1010] animate-fade-in">
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center space-x-2 px-4 py-2 hover:bg-red-50 text-red-600 font-medium transition-colors"
              >
                <FaSignOutAlt className="text-red-600" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  </div>
</header>


      {/* Main Content */}
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Hero Section */}
    <div className="text-center mb-8 sm:mb-16 px-4 sm:px-6">
  <h2 className="font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight 
                 text-[1.25rem] sm:text-[1.75rem] md:text-[2.25rem] lg:text-[2.5rem]">
    Manage your contacts with ease and efficiency
  </h2>
</div>
  


          {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Add Contact */}
          <Link
            to="/add-contact"
            className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 sm:p-8 border border-white/30 hover:border-green-200 group transform hover:-translate-y-3 hover:scale-105 active:scale-95"
          >
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 group-hover:from-green-200 group-hover:to-emerald-200 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <FaPlus className="text-green-600 text-2xl sm:text-3xl lg:text-4xl group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                Add Contact
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Add new contacts to your phonebook with all the essential details
              </p>
            </div>
          </Link>

          {/* View Contacts */}
          <Link
            to="/contacts"
            className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 sm:p-8 border border-white/30 hover:border-blue-200 group transform hover:-translate-y-3 hover:scale-105 active:scale-95"
          >
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <FaList className="text-blue-600 text-2xl sm:text-3xl lg:text-4xl group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                View Contacts
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Browse, search, and manage all your saved contacts in one place
              </p>
            </div>
          </Link>

          {/* AI Assistant */}
          <Link
            to="/chatbot"
            className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 sm:p-8 border border-white/30 hover:border-purple-200 group transform hover:-translate-y-3 hover:scale-105 active:scale-95 sm:col-span-2 lg:col-span-1"
          >
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-100 to-violet-100 group-hover:from-purple-200 group-hover:to-violet-200 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <FaComments className="text-purple-600 text-2xl sm:text-3xl lg:text-4xl group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">
                AI Assistant
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Use natural language to manage your contacts with our smart chatbot
              </p>
            </div>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
            Why Choose PhoneBook?
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center">
            <div className="group">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <i className="fas fa-shield-alt text-blue-600 text-lg sm:text-2xl lg:text-3xl"></i>
              </div>
              <h4 className="font-bold text-gray-800 text-xs sm:text-sm lg:text-base mb-1">Secure</h4>
              <p className="text-gray-600 text-xs sm:text-sm">Protected data</p>
            </div>
            
            <div className="group">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <i className="fas fa-sync-alt text-green-600 text-lg sm:text-2xl lg:text-3xl"></i>
              </div>
              <h4 className="font-bold text-gray-800 text-xs sm:text-sm lg:text-base mb-1">Sync</h4>
              <p className="text-gray-600 text-xs sm:text-sm">Real-time updates</p>
            </div>
            
            <div className="group">
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <i className="fas fa-search text-purple-600 text-lg sm:text-2xl lg:text-3xl"></i>
              </div>
              <h4 className="font-bold text-gray-800 text-xs sm:text-sm lg:text-base mb-1">Search</h4>
              <p className="text-gray-600 text-xs sm:text-sm">Quick find</p>
            </div>
            
            <div className="group">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <i className="fas fa-mobile-alt text-orange-600 text-lg sm:text-2xl lg:text-3xl"></i>
              </div>
              <h4 className="font-bold text-gray-800 text-xs sm:text-sm lg:text-base mb-1">Mobile</h4>
              <p className="text-gray-600 text-xs sm:text-sm">Responsive design</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center shadow-xl border border-white/30 group hover:bg-white/80 transition-all duration-300">
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-users"></i>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Unlimited Contacts</h4>
            <p className="text-gray-600 text-sm sm:text-base">Store as many contacts as you need</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center shadow-xl border border-white/30 group hover:bg-white/80 transition-all duration-300">
            <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-bolt"></i>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Lightning Fast</h4>
            <p className="text-gray-600 text-sm sm:text-base">Quick search and instant access</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center shadow-xl border border-white/30 group hover:bg-white/80 transition-all duration-300">
            <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-brain"></i>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Smart AI</h4>
            <p className="text-gray-600 text-sm sm:text-base">AI-powered contact management</p>
          </div>
        </div>
      </main>
    </div>
  );
}
