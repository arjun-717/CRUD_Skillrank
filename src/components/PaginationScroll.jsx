import { motion } from "framer-motion";

export default function PaginationScroll({
  totalPages,
  currentPage,
  onPageChange,
  windowSize = 1,
}) {
const getPages = () => {
  if (totalPages <= 1) return [1];

  const pages = [];

  const start = Math.max(2, currentPage - windowSize);
  const end = Math.min(totalPages - 1, currentPage + windowSize);

  // Always include first page
  pages.push(1);

  // Ellipsis if gap between 1 and start
  if (start > 2) {
    pages.push("ellipsis");
  }

  // Add sliding window
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Ellipsis if gap between end and last
  if (end < totalPages - 1) {
    pages.push("ellipsis");
  }

  // Always include last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
};

  const pages = getPages();

  return (
<div className="flex justify-center items-center gap-2 px-2 py-5 flex-wrap">
  {/* Prev button - hidden on mobile */}
  <motion.button
    onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
    disabled={currentPage === 1}
    className="hidden sm:block px-3 py-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
    whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
    whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
  >
    Prev
  </motion.button>

  {/* Show full pagination for both desktop & mobile */}
  <div className="flex gap-2 flex-wrap">
    {pages.map((page, idx) =>
      page === "ellipsis" ? (
        <span
          key={`ellipsis-${idx}`}
          className="px-2 text-gray-500 select-none"
        >
          ...
        </span>
      ) : (
        <motion.button
          key={`page-${page}-${idx}`}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
            currentPage === page
              ? "bg-blue-600 text-white scale-110 shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {page}
        </motion.button>
      )
    )}
  </div>

  {/* Next button - hidden on mobile */}
  <motion.button
    onClick={() =>
      currentPage < totalPages && onPageChange(currentPage + 1)
    }
    disabled={currentPage === totalPages}
    className="hidden sm:block px-3 py-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
    whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
    whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
  >
    Next
  </motion.button>
</div>


  );
}
