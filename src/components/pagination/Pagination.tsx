interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageRange = () => {
    const delta = 2; // Number of pages to show before and after current page

    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Add first page
    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    range.unshift(1);

    // Add last page
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="flex items-center justify-center space-x-1 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md text-sm font-medium
          ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
          }`}
      >
        Trước
      </button>

      <div className="flex items-center space-x-1">
        {getPageRange().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`px-3 py-1 rounded-md text-sm font-medium
              ${
                typeof page === "number" && page === currentPage
                  ? "bg-blue-600 text-white"
                  : page === "..."
                  ? "text-gray-500"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md text-sm font-medium
          ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
          }`}
      >
        Sau
      </button>
    </div>
  );
};

export default Pagination;
