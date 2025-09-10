import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaPhone } from "react-icons/fa";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim() || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await loginUser(form);
      const { token, user } = response.data;

      login(user, token);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
    }
    setIsSubmitting(false);
  };

  return (
<div className="min-h-screen login-background flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
  {/* Animated Background Elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="floating-shape shape-1"></div>
    <div className="floating-shape shape-2"></div>
    <div className="floating-shape shape-3"></div>
    <div className="floating-shape shape-4"></div>
    <div className="floating-shape shape-5"></div>
  </div>

  {/* Main Login Card */}
  <div className="relative z-10 w-full max-w-xs sm:max-w-xl lg:max-w-2xl xl:max-w-2xl 2xl:max-w-2xl mx-auto">
    <div className="login-card backdrop-blur-xl bg-white/20 rounded-xl sm:rounded-3xl shadow-2xl 
                p-5 sm:p-6 md:p-8 lg:p-10 border border-white/30 relative">
      {/* Top Left Logo */}
      <div className="absolute top-2 left-2 z-20">
        <div className="flex items-center px-1 sm:px-2 py-1 sm:py-2">
          <div className="phone-icon bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 w-5 h-5 sm:w-7 sm:h-7 rounded-md flex items-center justify-center mr-1 sm:mr-2">
            <FaPhone className="text-white text-[10px] sm:text-sm" />
          </div>
          <h1 className="text-[10px] sm:text-sm font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            PhoneBook
          </h1>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-6 sm:mb-6 mt-6  sm:mt-6">
        <h2 className="text-lg sm:text-3xl font-bold text-gray-700 mb-1 sm:mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600 text-xs sm:text-base font-medium">
          Sign in to your PhoneBook account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Username */}
        <div className="form-group">
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
            Username
          </label>
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 z-10">
              <FaUser className="text-gray-400 text-xs sm:text-sm" />
            </div>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="input-field w-full pl-9 sm:pl-12 pr-3 sm:pr-4
              py-2 sm:py-3 text-xs sm:text-sm lg:text-base
              placeholder:text-[11px] sm:placeholder:text-sm lg:placeholder:text-lg
              bg-white/70 backdrop-blur-sm border border-white/40 
              rounded-lg sm:rounded-2xl
              focus:outline-none focus:ring-4 focus:ring-blue-500/30 
              focus:border-blue-400 transition-all duration-300
              text-gray-800 placeholder-gray-500"
              placeholder="Enter your username"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 z-10">
              <FaLock className="text-gray-400 text-xs sm:text-sm" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field w-full pl-9 sm:pl-12 pr-10 sm:pr-14
              py-2 sm:py-3 text-xs sm:text-sm lg:text-base
              placeholder:text-[11px] sm:placeholder:text-sm lg:placeholder:text-lg
              bg-white/70 backdrop-blur-sm border border-white/40 
              rounded-lg sm:rounded-2xl
              focus:outline-none focus:ring-4 focus:ring-blue-500/30 
              focus:border-blue-400 transition-all duration-300
              text-gray-800 placeholder-gray-500"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200 z-10"
            >
              {showPassword ? <FaEyeSlash className="text-sm sm:text-lg" /> : <FaEye className="text-sm sm:text-lg" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-btn w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white py-2.5 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-4 sm:mt-8 text-center">
        <p className="text-gray-600 text-[10px] sm:text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-700 font-semibold underline decoration-2 underline-offset-4 hover:decoration-blue-600 transition-all duration-200"
          >
            Sign up here
          </Link>
        </p>
      </div>

      {/* Additional Features */}
      <div className="mt-3 sm:mt-6 pt-3 sm:pt-6 border-t border-white/20">
        <div className="flex  sm:flex-row gap-2 sm:gap-6 justify-center items-center text-[10px] sm:text-xs text-gray-500">
          <span className="flex items-center">
            <i className="fas fa-shield-alt mr-1 text-green-500"></i>
            Secure Login
          </span>
          <span className="flex items-center">
            <i className="fas fa-mobile-alt mr-1 text-blue-500"></i>
            Mobile Friendly
          </span>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
