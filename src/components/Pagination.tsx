type PaginationProps = {
  currentPage: number;
  onPageChange: (newPage: number) => void;
};

const Pagination = ({ currentPage, onPageChange }: PaginationProps) => {
  return (
    <div className="pagination-container">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous Page
      </button>
      <span>Page {currentPage}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>
        Next Page
      </button>
    </div>
  );
};

export default Pagination;