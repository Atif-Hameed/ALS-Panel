import React from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const Pagination = ({ totalPages, currentPage, handlePageChange, activeColor, className }) => {
  const getVisiblePages = () => {
    let startPage = Math.max(1, Math.min(currentPage - 1, totalPages - 3));
    let endPage = Math.min(startPage + 3, totalPages);
    
    // Adjust if we're at the beginning
    if (currentPage <= 2) {
      startPage = 1;
      endPage = Math.min(4, totalPages);
    }
    
    // Adjust if we're at the end
    if (currentPage >= totalPages - 1) {
      startPage = Math.max(1, totalPages - 3);
      endPage = totalPages;
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div>
      {totalPages > 1 && (
        <div className={`flex justify-center items-center mt-6 sm:mb-20 mb-7 ${className}`}>
          <button
            className={`px-2 py-2.5 mx-1 cursor-pointer ${currentPage === 1 ? 'text-[#C4CDD5]' : 'text-blueMain'}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <IoIosArrowBack className='text-xl' />
          </button>

          {getVisiblePages().map((page) => (
            <button
              key={page}
              className={`px-3 flex justify-center cursor-pointer text-center py-1 font-semibold sm:text-sm text-xs mx-1 rounded-lg ${
                currentPage === page 
                  ? `text-white ${activeColor || 'bg-dark'}` 
                  : 'text-blueMain bg-white'
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className={`px-2 py-2.5 mx-1 cursor-pointer ${currentPage === totalPages ? 'text-[#C4CDD5]' : 'text-blueMain'}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <IoIosArrowForward className='text-xl' />
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;