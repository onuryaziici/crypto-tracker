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
        Önceki Sayfa
      </button>
      <span>Sayfa {currentPage}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>
        Sonraki Sayfa
      </button>
    </div>
  );
};

export default Pagination;