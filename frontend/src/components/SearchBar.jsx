import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";

function SearchBar({ query, setQuery, searchSongs }) {
  return (
    <div className="search-container">

      <div className="search-box">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="What do you want to listen to?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchSongs();
            }
          }}
        />

      </div>

      <button onClick={searchSongs}>
        Search
      </button>

    </div>
  );
}

export default SearchBar;