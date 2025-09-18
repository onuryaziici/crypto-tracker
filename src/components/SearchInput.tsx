import { FaSearch } from 'react-icons/fa'; // İkonu import ediyoruz

type SearchInputProps = {
  onSearch: (query: string) => void;
};

const SearchInput = ({ onSearch }: SearchInputProps) => {
  return (
    // CSS'te tanımladığımız yeni wrapper'ı kullanıyoruz
    <div className="search-wrapper">
      <FaSearch className="search-icon" /> {/* İkonu ekliyoruz */}
      <input
        type="text"
        placeholder="Search for a crypto..."
        className="search-input"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;