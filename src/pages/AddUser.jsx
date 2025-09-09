import { useState } from "react";
import { createUser } from "../services/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";



export default function AddUser({ onSuccess = () => { } }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    age: "",
  });


  const UserAdded = () => {

    toast.success("User Added Successfully")
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    let { name, email, address, phone, age } = form;
    name = name.toLowerCase();
    email = email.toLowerCase();
    address = address.toLowerCase();
    
    const ageNum = Number(age);
    if (!/^\d+$/.test(age) || ageNum < 1 || ageNum > 120) {
      toast.error("Age must be a number between 1 and 120");
      return;
    }

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
       const response = await createUser({ name, email, address, phone: formattedPhone, age });
      if (response.error) {
        toast.error(response.error);
         setIsSubmitting(false);
        return;
      }
      UserAdded();
      setForm({ name: "", email: "", address: "", phone: "", age: "" });
      onSuccess();
    } catch (error) {
      if (error?.response?.status === 409) {
        toast.error("User with these details already exists!");
      } else {
        toast.error("Error adding user. Please try again.");
      }
    }
    setIsSubmitting(false);
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
            <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-8 md:px-16 rounded-lg shadow-md font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 ${
              isSubmitting ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            <i
              className={`fa-solid fa-user mr-2 ${
                isSubmitting ? "fa-spinner fa-spin" : ""
              }`}
            ></i>{" "}
            {isSubmitting ? "Adding..." : "Add"}
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
