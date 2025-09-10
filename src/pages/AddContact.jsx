import { useState } from "react";
import { createContact } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function AddContact({ onSuccess = () => {} }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const navigate = useNavigate();

  const contactAdded = () => {
    toast.success("Contact Added Successfully");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let { name, email, address, phone } = form;
    
    name = name.toLowerCase();
    email = email.toLowerCase();
    address = address.toLowerCase();

    if (!/[a-zA-Z]/.test(address)) {
      toast.error("Address must contain at least one alphabet character");
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (!/^\d{10}$/.test(phoneDigits)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    const formattedPhone = '+91 ' + phoneDigits;

    try {
      setIsSubmitting(true);
      const response = await createContact({
        name,
        email,
        address,
        phone: formattedPhone,
      });

      if (response.error) {
        toast.error(response.error);
        setIsSubmitting(false);
        return;
      }

      contactAdded();
      setForm({
        name: "",
        email: "",
        address: "",
        phone: "",
      });
      
      setTimeout(() => {
        navigate("/contacts");
      }, 1500);
      
    } catch (error) {
      if (error?.response?.status === 409) {
        toast.error("Contact with these details already exists!");
      } else {
        toast.error("Error adding contact. Please try again.");
      }
    }
    setIsSubmitting(false);
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative">

  {/* Animated Background Elements */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 left-10 w-20 h-20 bg-green-200/30 rounded-full blur-xl animate-pulse"></div>
    <div className="absolute top-1/3 right-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-bounce"></div>
    <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
  </div>

  {/* Sticky Header */}
   <header className="sticky top-0 z-[1000] bg-white/90 backdrop-blur-lg shadow-lg border-b border-white/20">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="group flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 active:scale-95"
          >
            <FaArrowLeft className="text-sm sm:text-base group-hover:animate-bounce" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-emerald-700 bg-clip-text text-transparent">
              Add New Contact
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Create a new contact record
            </p>
          </div>
        </div>
        <Link
          to="/contacts"
          className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
        >
          <span className="text-sm">View All</span>
        </Link>
      </div>
    </div>
  </header>


  {/* Main Content */}
  <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 relative z-10">
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/30 animate-fade-in-up">
      
      {/* Header Section */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg animate-bounce-gentle">
          <FaUser className="text-green-600 text-2xl sm:text-3xl animate-pulse" />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 animate-fade-in">
          Create New Contact
        </h2>
        <p className="text-gray-600 text-sm sm:text-base animate-fade-in delay-200">
          Enter contact details to create a new record
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

        {/* Name Field */}
        <div className="form-group animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 z-10">
              <FaUser className="text-gray-400 text-sm" />
            </div>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/90 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-400 transition-all duration-300 text-gray-800 placeholder-gray-400 text-sm sm:text-base hover:border-green-300"
              placeholder="Full name"
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="form-group animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 z-10">
              <FaEnvelope className="text-gray-400 text-sm" />
            </div>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/90 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-400 transition-all duration-300 text-gray-800 placeholder-gray-400 text-sm sm:text-base hover:border-green-300"
              placeholder="Email address"
              required
            />
          </div>
        </div>

        {/* Phone Field */}
        <div className="form-group animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 z-10">
              <FaPhone className="text-gray-400 text-sm" />
            </div>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/90 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-400 transition-all duration-300 text-gray-800 placeholder-gray-400 text-sm sm:text-base hover:border-green-300"
              placeholder="10-digit phone number"
              required
            />
          </div>
        </div>

        {/* Address Field */}
        <div className="form-group animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            rows="4"
            className="w-full pl-3 sm:pl-4 pr-4 py-3 sm:py-4 bg-white/90 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-400 transition-all duration-300 text-gray-800 placeholder-gray-400 text-sm sm:text-base resize-none hover:border-green-300"
            placeholder="Complete address"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 text-white py-3 sm:py-4 px-6 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
        >
          {isSubmitting ? 'Adding Contact...' : 'Add Contact'}
        </button>

      </form>
    </div>
  </main>
</div>


  );
}
