import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getContacts, deleteContact, updateContact, getContactById } from "../services/api";
import { Link } from "react-router-dom";
import PaginationScroll from "../components/PaginationScroll";
import { toast } from "react-toastify";
import DeleteConfirmToast from "../components/chatbot/DeleteConfirmToast";
import { FaTrash, FaTimes, FaSearch, FaUser, FaArrowLeft, FaPlus, FaPhone, FaEnvelope, FaMapMarkerAlt, FaEdit, FaCopy } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedContact, setSelectedContact] = useState(null);
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
      fetchContacts();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [page, searchTerm]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await getContacts(page, 18, searchTerm);
      setContacts(res.data.data);
      setTotalPages(res.data.total_pages);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to fetch contacts");
    }
    setLoading(false);
  };

  const handleSearchById = async () => {
    if (!searchById.trim()) {
      toast.error("Please enter a valid Contact ID");
      return;
    }

    setSearchingById(true);
    try {
      const res = await getContactById(searchById.trim());
      const contact = res.data;

      setSelectedContact(contact);
      setEditForm({
        name: contact.name || '',
        email: contact.email || '',
        address: contact.address || '',
        phone: contact.phone || '',
      });
      setHasChanges(false);
      setShowPopup(true);
      setDel(true);
      toast.success("Contact found successfully!");
    } catch (error) {
      console.error("Error fetching contact by ID:", error);
      toast.error("Contact not found or invalid ID");
    }
    setSearchingById(false);
  };

  const validateForm = () => {
    const errors = {};
    const normalized = {
      ...editForm,
      name: editForm.name?.toLowerCase() || '',
      email: editForm.email?.toLowerCase() || '',
      address: editForm.address?.toLowerCase() || '',
    };

    const requiredFields = ['name', 'email', 'address', 'phone'];
    requiredFields.forEach(field => {
      if (!normalized[field] || normalized[field].toString().trim() === '') {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (normalized.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (normalized.phone) {
      const phone = normalized.phone.trim();
      if (!/^\+91\s\d{10}$/.test(phone)) {
        errors.phone = 'Enter valid phone number (+91 prefix important)';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDelete = (id) => {
    if (del === true) {
      setDel(false);
      toast(
        ({ closeToast }) => (
          <DeleteConfirmToast
            onConfirm={async () => {
              try {
                await deleteContact(id);
                setContacts((prev) => prev.filter((contact) => contact._id !== id));
                toast.success("Contact deleted successfully!", { position: "top-right" });
                closeToast();
                setShowPopup(false);
                fetchContacts();
              } catch (error) {
                toast.error("Failed to delete contact!", { position: "top-right" });
              }
            }}
            onCancel={() => {
              closeToast();
              setDel(true);
            }}
          />
        ),
        {
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          closeButton: false,
          position: "top-center",
          className: "rounded-lg shadow-lg bg-white border border-gray-200",
          style: { minWidth: "300px" },
        }
      );
    }
  };

  const handleShowContact = (contact) => {
    setSelectedContact(contact);
    setDel(true);
    setEditForm({
      name: contact.name || '',
      email: contact.email || '',
      address: contact.address || '',
      phone: contact.phone || '',
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

    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    const hasFormChanges = Object.keys(editForm).some(key => {
      if (key === field) {
        return (selectedContact[key] || '') !== value;
      }
      return (selectedContact[key] || '') !== (editForm[key] || '');
    });

    setHasChanges(hasFormChanges || (selectedContact[field] || '') !== value);
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
      const updatedData = {
        ...editForm,
        name: editForm.name?.toLowerCase() || '',
        email: editForm.email?.toLowerCase() || '',
        address: editForm.address?.toLowerCase() || '',
      };

      await updateContact(selectedContact._id, updatedData);
      setContacts(contacts.map(contact =>
        contact._id === selectedContact._id
          ? { ...contact, ...updatedData }
          : contact
      ));
      setSelectedContact({ ...selectedContact, ...updatedData });
      setHasChanges(false);
      setFormErrors({});
      toast.success("Contact updated successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Failed to update contact!");
    }
    setIsUpdating(false);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => {
        const searchInput = document.getElementById('mobile-search-input');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    (contact.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (contact.email?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (contact.phone?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-32 h-32 bg-purple-200/30 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 right-10 w-28 h-28 bg-pink-200/30 rounded-full blur-xl animate-bounce delay-500"></div>
      </div>

      {/* Enhanced Fixed Header */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${nav ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-white/60 backdrop-blur-sm shadow-md'} border-b border-white/20 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center space-x-3 sm:space-x-4 animate-slide-in-left">
              <Link
                to="/"
                className="group flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 active:scale-95"
              >
                <FaArrowLeft className="text-sm sm:text-base group-hover:animate-bounce" />
              </Link>

              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                View Contacts
              </h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={toggleSearch}
                className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 active:scale-95"
              >
                {showSearch ? (
                  <FaTimes className="text-sm sm:text-base animate-spin" />
                ) : (
                  <FaSearch className="text-sm sm:text-base animate-pulse" />
                )}
              </button>

              <div className="hidden md:block">
                <Link
                  to="/add-contact"
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 active:scale-95 animate-slide-in-right"
                >
                  <FaPlus className="text-sm sm:text-base" />
                  <span className="text-sm sm:text-base font-semibold hidden sm:inline">Add Contact</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Fixed Search Section */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 sm:top-20 left-0 w-full z-40 bg-white/95 backdrop-blur-lg border-b border-white/30 shadow-xl"
            style={{ boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)' }}
          >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
  <div className="space-y-4">
    {/* General Search */}
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
        <FaSearch className="text-gray-400 text-sm" />
      </div>
      <input
        id="mobile-search-input"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name, email, or phone..."
        className="w-full pl-10 pr-3 py-2 bg-white/90 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-gray-800 placeholder-gray-400 text-sm sm:text-sm hover:border-blue-300 shadow-sm transition-all duration-300"
      />
    </div>

    {/* Search by ID */}
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <input
        type="text"
        value={searchById}
        onChange={(e) => setSearchById(e.target.value)}
        placeholder="Search by Contact ID..."
        className="flex-1 px-3 py-2 bg-white/90 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-gray-800 placeholder-gray-400 text-sm sm:text-sm hover:border-blue-300 shadow-sm transition-all duration-300"
        onKeyPress={(e) => { if (e.key === 'Enter') handleSearchById(); }}
      />
      <button
        onClick={handleSearchById}
        disabled={searchingById}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105 text-sm font-medium"
      >
        {searchingById ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        ) : (
          <FaSearch className="text-sm" />
        )}
        <span>Find</span>
      </button>
    </div>
  </div>
</div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with Proper Offset */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10 ${showSearch ? 'pt-32 sm:pt-40' : 'pt-20 sm:pt-24'} transition-all duration-300`}>
        {/* Contacts Grid */}
        {loading ? (
<div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[...Array(12)].map((_, idx) => (
              <div key={idx} className="h-full flex flex-col bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg animate-pulse border border-white/30">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="space-y-2 flex-grow">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <div className={`text-center py-12 sm:py-16 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} 
               style={{ animationDelay: '400ms' }}>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-gentle shadow-lg">
              <FaUser className="text-gray-400 text-2xl sm:text-3xl" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Start building your phonebook by adding your first contact.</p>
            <Link
              to="/add-contact"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <FaPlus />
              <span>Add Your First Contact</span>
            </Link>
          </div>
        ) : (
<div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact._id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100 
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -8,
                  transition: { duration: 0.3, type: "spring", stiffness: 300 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleShowContact(contact)}
                className="h-full flex flex-col contact-card relative bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-white/40 cursor-pointer group overflow-hidden"
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl"></div>
                
                {/* Shimmer Effect */}
                <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover:animate-shimmer"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Contact Avatar Section */}
                  <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    <div className="relative flex-shrink-0">
                      <div className="bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200 group-hover:from-blue-200 group-hover:via-blue-300 group-hover:to-indigo-300 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg group-hover:shadow-xl">
                        <FaUser className="text-blue-600 group-hover:text-blue-700 text-lg sm:text-xl lg:text-2xl group-hover:scale-110 transition-all duration-300" />
                      </div>
                      {/* Online Indicator */}
                      {/* <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div> */}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-700 truncate capitalize text-base sm:text-lg lg:text-xl transition-colors duration-300 mb-1">
                        {contact.name || 'No Name'}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-300 font-medium">
                        Click to view details
                      </p>
                    </div>
                  </div>

                  {/* Contact Info Cards - Flex grow to fill space */}
                  <div className="space-y-3 sm:space-y-4 flex-grow">
                    {/* Email */}
                    <div className="flex items-center space-x-3 p-2 sm:p-3 bg-gray-50/80 group-hover:bg-blue-50/80 rounded-xl transition-all duration-300">
                      <div className="bg-white p-2 rounded-lg shadow-sm flex-shrink-0">
                        <FaEnvelope className="text-gray-400 group-hover:text-blue-500 text-sm transition-colors duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium mb-1">Email</p>
                        <p className="truncate text-sm sm:text-base text-gray-700 group-hover:text-blue-600 transition-colors duration-300 font-medium">
                          {contact.email}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-3 p-2 sm:p-3 bg-gray-50/80 group-hover:bg-green-50/80 rounded-xl transition-all duration-300">
                      <div className="bg-white p-2 rounded-lg shadow-sm flex-shrink-0">
                        <FaPhone className="text-gray-400 group-hover:text-green-500 text-sm transition-colors duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium mb-1">Phone</p>
                        <p className="truncate text-sm sm:text-base text-gray-700 group-hover:text-green-600 transition-colors duration-300 font-medium">
                          {contact.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  
                </div>

                {/* Corner Decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-3xl transform rotate-45 translate-x-10 -translate-y-10 group-hover:from-blue-500/20 transition-colors duration-500"></div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 sm:mt-12">
            <PaginationScroll
              totalPages={totalPages}
              currentPage={page}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </main>

      {/* Enhanced Contact Details Popup */}
   <AnimatePresence>
  {showPopup && selectedContact && (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl w-full max-w-md sm:max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
              <FaUser className="text-white text-lg" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Contact Details</h2>
          </div>
          <button
            onClick={() => setShowPopup(false)}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg transition-colors duration-200"
            aria-label="Close"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Contact ID */}
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-200">
            <code className="text-blue-600 font-mono text-xs sm:text-sm break-all">{selectedContact._id}</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedContact._id);
                toast.success("Contact ID copied!");
              }}
              className="text-blue-600 hover:text-blue-800 p-1 rounded transition duration-200"
            >
              <FaCopy />
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-3">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-sm ${formErrors.name ? 'border-red-500' : 'border-gray-200'}`}
                  required
                />
              </div>
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-sm ${formErrors.email ? 'border-red-500' : 'border-gray-200'}`}
                  required
                />
              </div>
              {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={editForm.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-sm ${formErrors.phone ? 'border-red-500' : 'border-gray-200'}`}
                  required
                />
              </div>
              {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  value={editForm.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows="2"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-sm resize-none ${formErrors.address ? 'border-red-500' : 'border-gray-200'}`}
                  required
                />
              </div>
              {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              {hasChanges && (
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-transform duration-200 hover:scale-105 disabled:opacity-50"
                >
                  {isUpdating ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : <FaEdit />}
                  <span>{isUpdating ? 'Updating...' : 'Update'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(selectedContact._id)}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-transform duration-200 hover:scale-105"
              >
                <FaTrash />
                <span>Delete</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>


      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-shimmer { animation: shimmer 1.5s ease-out; }
        .animate-bounce-gentle { animation: bounce-gentle 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
