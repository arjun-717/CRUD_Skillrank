import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUsers, deleteUser, updateUser, getUserById } from "../services/api";
import { Link } from "react-router-dom";
import PaginationScroll from "../components/PaginationScroll";
import { toast } from "react-toastify";
import { FaTrash, FaTimes, FaSearch, FaUser } from "react-icons/fa";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [nav, setNav] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [del, setDel] = useState(false);
  const [searchById, setSearchById] = useState("");
  const [searchingById, setSearchingById] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const HandleScroll = () => {
      if (window.scrollY > 50) {
        setNav(true);
      } else {
        setNav(false);
      }
    };

    window.addEventListener("scroll", HandleScroll);
    return () => {
      window.removeEventListener("scroll", HandleScroll);
    };
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [page, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers(page, 18, searchTerm);
      setUsers(res.data.data);
      setTotalPages(res.data.total_pages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  const handleSearchById = async () => {
    if (!searchById.trim()) {
      toast.error("Please enter a valid User ID");
      return;
    }

    setSearchingById(true);
    try {
      const res = await getUserById(searchById.trim());
      const user = res.data;
      
      // Show the found user in popup
      setSelectedUser(user);
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        phone: user.phone || '',
        age: user.age || ''
      });
      setHasChanges(false);
      setShowPopup(true);
      setDel(true);
      
      toast.success("User found successfully!");
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      toast.error("User not found or invalid ID");
    }
    setSearchingById(false);
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ['name', 'email', 'address', 'phone', 'age'];
    
    requiredFields.forEach(field => {
      if (!editForm[field] || editForm[field].toString().trim() === '') {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Email validation
    if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic)
    if (editForm.phone && !/^\d{10,15}$/.test(editForm.phone.replace(/\s+/g, ''))) {
      errors.phone = 'Please enter a valid phone number (10-15 digits)';
    }

    // Age validation
    if (editForm.age && (isNaN(editForm.age) || editForm.age < 1 || editForm.age > 120)) {
      errors.age = 'Please enter a valid age (1-120)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDelete = (id) => {
    if (del == true) {
      setDel(false);
      toast(
        ({ closeToast }) => (
          <div className="flex flex-col items-center p-3">
            <div className="flex items-center gap-2 text-red-600 font-bold text-lg mb-2">
              <FaTrash className="text-xl" />
              <span>Confirm Deletion</span>
            </div>

            <p className="text-gray-700 text-sm mb-4 text-center">
              Are you sure you want to delete this user?
              <span className="font-semibold text-red-500"> This action cannot be undone.</span>
            </p>

            <div className="flex gap-4">
              <button
                onClick={async () => {
                  try {
                    await deleteUser(id);
                    setUsers((prev) => prev.filter((user) => user._id !== id));
                    toast.success("User deleted successfully!", { position: "top-right" });

                    closeToast();
                    setShowPopup(false);
                    fetchUsers();
                  } catch (error) {
                    toast.error("Failed to delete user!", { position: "top-right" });
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => {
                  closeToast();
                  setDel(true);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg shadow-md transition flex items-center gap-1"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        ),
        {
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          position: "top-center",
          className: "rounded-lg shadow-lg bg-white border border-gray-200",
          style: { minWidth: "300px" },
        }
      );
    }
  };

  const handleShowUser = (user) => {
    setSelectedUser(user);
    setDel(true);

    setEditForm({
      name: user.name || '',
      email: user.email || '',
      address: user.address || '',
      phone: user.phone || '',
      age: user.age || ''
    });
    setHasChanges(false);
    setFormErrors({});
    setShowPopup(true);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    const hasFormChanges = Object.keys(editForm).some(key => {
      if (key === field) {
        return (selectedUser[key] || '') !== value;
      }
      return (selectedUser[key] || '') !== (editForm[key] || '');
    });
    setHasChanges(hasFormChanges || (selectedUser[field] || '') !== value);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    if (!validateForm()) {
      toast.error("Please fix all validation errors");
      return;
    }

    setIsUpdating(true);
    try {
      await updateUser(selectedUser._id, editForm);
      setUsers(users.map(user =>
        user._id === selectedUser._id
          ? { ...user, ...editForm }
          : user
      ));
      setSelectedUser({ ...selectedUser, ...editForm });
      setHasChanges(false);
      setFormErrors({});
      console.log("User updated");
      toast.success("User Updated successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user!");
    }
    setIsUpdating(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (user.phone?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div
        className={`flex flex-col gap-4 mb-6 pt-4 px-4 sm:px-6 lg:px-10 sticky top-0 z-10 transition-all duration-300 ${nav ? "scroll" : ""}`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
            <i className="fa-solid fa-users text-blue-500 mr-2"></i>
            User List
          </h1>

          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6">
            <Link
              to="/adduser"
              className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-lg shadow-md hover:opacity-90 transition text-sm sm:text-base"
            >
              + Add User
            </Link>
            <Link
              to="/"
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-lg shadow-md hover:opacity-90 transition text-sm sm:text-base"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Back
            </Link>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* General Search */}
          <div className="flex items-center flex-1 bg-white border border-gray-300 rounded-full shadow-sm px-3 py-2 md:px-4 md:py-2 focus-within:ring-2 focus-within:ring-indigo-500 transition">
            <FaSearch className="text-gray-400 text-base md:text-lg mr-2 md:mr-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base"
            />
          </div>

          {/* Search by ID */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm px-3 py-2 md:px-4 md:py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <FaUser className="text-gray-400 text-base md:text-lg mr-2" />
              <input
                type="text"
                value={searchById}
                onChange={(e) => setSearchById(e.target.value)}
                placeholder="Search by User ID..."
                className="outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base w-40"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchById();
                  }
                }}
              />
            </div>
            <button
              onClick={handleSearchById}
              disabled={searchingById}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition disabled:opacity-50 flex items-center gap-2"
            >
              {searchingById ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <FaSearch />
              )}
              Find
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(12)].map((_, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-lg shadow-md border border-gray-200 animate-pulse"
              >
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-10 bg-gray-300 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <p className="text-center mt-6 text-gray-600">No users found.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-transform hover:scale-102 duration-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{user.name || 'No Name'}</h3>
                    <p className="text-sm text-gray-500">Click to view details</p>
                  </div>
                  <button
                    onClick={() => handleShowUser(user)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
                  >
                    Show
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="sticky bottom-0 z-50 bg-white/30 backdrop-blur-sm flex justify-center">
          <PaginationScroll
            totalPages={totalPages}
            currentPage={page}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>

        <AnimatePresence>
          {showPopup && selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowPopup(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={editForm.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows="2"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />
                    {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />
                    {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={editForm.age || ''}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value) || '')}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.age ? 'border-red-500' : 'border-gray-300'}`}
                      min="1"
                      max="120"
                      required
                    />
                    {formErrors.age && <p className="text-red-500 text-xs mt-1">{formErrors.age}</p>}
                  </div>
                </form>

                <div className="flex gap-3 justify-end">
                  {hasChanges && (
                    <button
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-2 disabled:opacity-50"
                    >
                      <i className={`fa-solid ${isUpdating ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
                      {isUpdating ? 'Updating...' : 'Update'}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedUser._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-2"
                  >
                    <i className="fa-solid fa-trash"></i>
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}