import React from "react";
import "../scss/common/PageComponent.scss";

/**
 * PageComponent: 페이지네이션 UI를 렌더링하는 컴포넌트.
 *
 * @param {Object} serverData - 서버에서 가져온 페이지네이션 데이터.
 * @param {Function} movePage - 페이지 이동을 처리하는 함수.
 * @returns {JSX.Element} - 페이지네이션 UI를 포함하는 JSX 요소.
 */
const PageComponent = ({ pageRequest, onPageChange, totalItems }) => {
  const totalPages = Math.ceil(totalItems / pageRequest.size);

  return (
    <div className="pagination-container">
      {pageRequest.page > 1 && (
        <div className="page-button" onClick={() => onPageChange(1)}>
          {"<<"}
        </div>
      )}

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (pageNum) => (
          <div
            key={pageNum}
            className={`page-button ${pageRequest.page === pageNum ? "active" : ""}`}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </div>
        ),
      )}

      {pageRequest.page < totalPages && (
        <div className="page-button" onClick={() => onPageChange(totalPages)}>
          {">>"}
        </div>
      )}
    </div>
  );
};

export default PageComponent;
