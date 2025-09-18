type SearchInputProps = {
  onSearch: (query: string) => void;
};

const SearchInput = ({ onSearch }: SearchInputProps) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Kripto para ara..."
        className="search-input"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;