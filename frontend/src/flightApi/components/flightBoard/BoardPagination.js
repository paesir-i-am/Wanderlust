// Pagination.js
import React from 'react';
import './BoardPagination.scss';

const BoardPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <div className="pagination">
      <button 
        onClick={() => onPageChange(1)} 
        disabled={currentPage === 1}
        className="pagination-button"
      >
        처음
      </button>
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className="pagination-button"
      >
        이전
      </button>
      
      {getPageNumbers().map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`pagination-button ${currentPage === number ? 'active' : ''}`}
        >
          {number}
        </button>
      ))}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        다음
      </button>
      <button 
        onClick={() => onPageChange(totalPages)} 
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        마지막
      </button>
    </div>
  );
};

export default BoardPagination;