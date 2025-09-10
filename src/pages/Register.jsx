import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaPhone, FaEnvelope } from "react-icons/fa";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.username.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await registerUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password
      });
      
      const { token, user } = response.data;
      login(user, token);
      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed");
    }
    setIsSubmitting(false);
  };

  return (
<div className="min-h-screen login-background flex items-center justify-center p-2 sm:p-4 lg:p-6 relative overflow-hidden">
  {/* Animated Background Elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="floating-shape shape-1"></div>
    <div className="floating-shape shape-2"></div>
    <div className="floating-shape shape-3"></div>
    <div className="floating-shape shape-4"></div>
    <div className="floating-shape shape-5"></div>
  </div>

  {/* Main Register Card */}
  <div className="relative z-10 w-full max-w-xs sm:max-w-xl lg:max-w-2xl xl:max-w-2xl 2xl:max-w-2xl mx-auto">
    <div className="login-card backdrop-blur-xl bg-white/20 rounded-2xl sm:rounded-3xl shadow-2xl 
                    p-5 sm:p-5 md:p-8 border border-white/30 relative">

      {/* Top Left Logo */}
      <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-20">
        <div className="flex items-center px-2 sm:px-3 py-2 sm:py-3">
          <div className="phone-icon bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 
                          w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg flex items-center justify-center mr-1 sm:mr-2">
            <FaPhone className="text-white text-xs sm:text-sm" />
          </div>
          <p className="text-[11px] sm:text-sm font-bold bg-gradient-to-r from-gray-600 via-green-800 to-emerald-800 bg-clip-text text-transparent">
            PhoneBook
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 mt-6 sm:mt-10 md:mt-14">
        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-700 mb-1">
          Create Account
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium px-2">
          Join PhoneBook today
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
        {/* Username */}
        <div className="form-group">
          <label className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
            Username
          </label>
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 z-10">
              <FaUser className="text-gray-400 text-[10px] sm:text-sm" />
            </div>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="input-field w-full pl-8 sm:pl-12 pr-3 sm:pr-4 
                         py-2 sm:py-3 bg-white/70 backdrop-blur-sm border border-white/40 
                         rounded-xl sm:rounded-2xl 
                         focus:outline-none focus:ring-2 sm:focus:ring-4 
                         focus:ring-green-500/30 focus:border-green-400 
                         transition-all duration-300 text-gray-800 
                         text-xs sm:text-sm md:text-base 
                         placeholder:text-[10px] sm:placeholder:text-xs md:placeholder:text-sm 
                         placeholder-gray-500"
              placeholder="Choose a username"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 z-10">
              <FaEnvelope className="text-gray-400 text-[10px] sm:text-sm" />
            </div>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field w-full pl-8 sm:pl-12 pr-3 sm:pr-4 
                         py-2 sm:py-3 bg-white/70 backdrop-blur-sm border border-white/40 
                         rounded-xl sm:rounded-2xl focus:outline-none 
                         focus:ring-2 sm:focus:ring-4 focus:ring-green-500/30 focus:border-green-400 
                         transition-all duration-300 text-gray-800 
                         text-xs sm:text-sm md:text-base 
                         placeholder:text-[10px] sm:placeholder:text-xs md:placeholder:text-sm 
                         placeholder-gray-500"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 z-10">
              <FaLock className="text-gray-400 text-[10px] sm:text-sm" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field w-full pl-8 sm:pl-12 pr-10 sm:pr-14 
                         py-2 sm:py-3 bg-white/70 backdrop-blur-sm border border-white/40 
                         rounded-xl sm:rounded-2xl focus:outline-none 
                         focus:ring-2 sm:focus:ring-4 focus:ring-green-500/30 focus:border-green-400 
                         transition-all duration-300 text-gray-800 
                         text-xs sm:text-sm md:text-base 
                         placeholder:text-[10px] sm:placeholder:text-xs md:placeholder:text-sm 
                         placeholder-gray-500"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors duration-200 z-10 p-1"
            >
              {showPassword ? <FaEyeSlash className="text-xs sm:text-lg" /> : <FaEye className="text-xs sm:text-lg" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 z-10">
              <FaLock className="text-gray-400 text-[10px] sm:text-sm" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="input-field w-full pl-8 sm:pl-12 pr-10 sm:pr-14 
                         py-2 sm:py-3 bg-white/70 backdrop-blur-sm border border-white/40 
                         rounded-xl sm:rounded-2xl focus:outline-none 
                         focus:ring-2 sm:focus:ring-4 focus:ring-green-500/30 focus:border-green-400 
                         transition-all duration-300 text-gray-800 
                         text-xs sm:text-sm md:text-base 
                         placeholder:text-[10px] sm:placeholder:text-xs md:placeholder:text-sm 
                         placeholder-gray-500"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors duration-200 z-10 p-1"
            >
              {showConfirmPassword ? <FaEyeSlash className="text-xs sm:text-lg" /> : <FaEye className="text-xs sm:text-lg" />}
            </button>
          </div>
        </div>

        {/* Submit Button (unchanged) */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-btn mt-2 w-full bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95 min-h-[44px] sm:min-h-[48px]"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <i className="fas fa-spinner fa-spin mr-2 text-sm sm:text-base"></i>
              <span className="text-sm sm:text-base">Creating account...</span>
            </span>
          ) : (
            <span className="text-sm sm:text-base font-semibold">Create Account</span>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-5 sm:mt-8 text-center">
        <p className="text-gray-600 text-[11px] sm:text-sm md:text-base px-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 hover:text-green-700 font-semibold underline decoration-2 underline-offset-4 hover:decoration-green-600 transition-all duration-200"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {/* Additional Features */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-6 border-t border-white/20">
        <div className="flex justify-center space-x-3 sm:space-x-6 text-[11px] sm:text-xs text-gray-500">
          <span className="flex items-center">
            <i className="fa-solid fa-shield mr-1 text-green-500"></i>
            <span className="hidden sm:inline">Secure Registration</span>
            <span className="sm:hidden">Secure</span>
          </span>
          <span className="flex items-center">
            <i className="fas fa-user-plus mr-1 text-green-500"></i>
            <span className="hidden sm:inline">Easy Setup</span>
            <span className="sm:hidden">Easy</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
