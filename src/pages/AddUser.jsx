import { useState } from "react";
import { createUser } from "../services/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddUser({ onSuccess = () => {} }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    age: "",
  });

  // toast
  const UserAdded = () =>{
    toast.success("User Addes Successfully")
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser(form);
    UserAdded();
    setForm({ name: "", email: "", address: "", phone: "", age: "" });
    onSuccess(); 
  };

    return (
   <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex flex-col justify-center items-center p-4">
  <div className="w-full max-w-lg md:max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 transition-transform hover:scale-[1.01]">
    <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-700 mb-3 text-center">
      Add New User
    </h2>
    <p className="mb-6 md:mb-8 text-gray-600 text-center text-base md:text-lg">
      Enter user credentials to create a new record
    </p>

    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Name Input */}
      <input
        className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-300"
        placeholder="Enter Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      {/* Email Input */}
      <input
        className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-300"
        type="email"
        placeholder="Enter Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      {/* Address Input */}
      <input
        className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-300"
        type="text"
        placeholder="Enter Address"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        required
      />

      {/* Phone Input */}
      <input
        className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-300"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="Enter Phone Number"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        required
      />

      {/* Age Input */}
      <input
        className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-300"
        type="number"
        placeholder="Enter Age"
        value={form.age}
        onChange={(e) => setForm({ ...form, age: e.target.value })}
        required
      />

      {/* Buttons */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6">
        <button className="w-full md:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-8 md:px-16 rounded-lg shadow-md font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105">
          <i className="fa-solid fa-user mr-2"></i> Add
        </button>
        <Link
          to="/"
          className="w-full md:w-auto text-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-8 md:px-16 rounded-lg shadow-md font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Back
        </Link>
      </div>
    </form>
  </div>
</div>


    );
}
