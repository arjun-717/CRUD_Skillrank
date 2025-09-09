import React, { useState } from "react";
import { FaTrash, FaTimes } from "react-icons/fa";

function DeleteConfirmToast({ onConfirm, onCancel }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
  };

  return (
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
          onClick={handleClick}
          disabled={isDeleting}
          className={`bg-red-500 text-white px-4 py-2 rounded-lg shadow-md transition ${
            isDeleting ? "bg-red-400 cursor-not-allowed" : "hover:bg-red-600"
          }`}
        >
          {isDeleting ? (
            <>
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              Deleting...
            </>
          ) : (
            "Yes, Delete"
          )}
        </button>

        <button
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg shadow-md transition flex items-center gap-1"
        >
          <FaTimes /> Cancel
        </button>
      </div>
    </div>
  );
}

export default DeleteConfirmToast;
