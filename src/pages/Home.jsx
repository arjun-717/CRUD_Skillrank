import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">

      <div className="mb-6 text-center px-4">
        <h1 className="text-2xl md:text-4xl font-extrabold text-indigo-700 drop-shadow-lg">
          CRUD Operations Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-md md:text-lg">
          Manage your records with ease and efficiency
        </p>
      </div>
      

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto px-4">
        <Link to="/adduser" className="w-full md:w-auto px-5 py-3 rounded-2xl bg-indigo-600 text-white text-base md:text-lg font-semibold shadow-md hover:bg-indigo-700 hover:scale-105 transition duration-300 flex items-center justify-center gap-2">
          <i className="fa-solid fa-plus"></i>
          Add Record
        </Link>
        <Link to="/users" className="w-full md:w-auto px-5 py-3 rounded-2xl bg-white text-indigo-600 text-base md:text-lg font-semibold shadow-md border border-indigo-300 hover:bg-indigo-50 hover:scale-105 transition duration-300 flex items-center justify-center gap-2">
          <i className="fa-solid fa-folder-open"></i>
          View Records
        </Link>
         <Link to="/selenium" className="w-full md:w-auto px-5 py-3 rounded-2xl bg-white text-indigo-600 text-base md:text-lg font-semibold shadow-md border border-indigo-300 hover:bg-indigo-50 hover:scale-105 transition duration-300 flex items-center justify-center gap-2">
          <i class="fa-solid fa-link"></i>
          Amazon Scraper
        </Link>
      </div>

    </div>
  );
}
