import React, { Fragment, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('react hooks');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchInputRef = useRef();

  useEffect(() => {
    getResults();
  }, []);

  const getResults = async () => {
    setLoading(true);

    try {
      const response = await axios
        .get(`http://hn.algolia.com/api/v1/search?query=${query}`);
      setResults(response.data.hits); 
    } catch(err) {
      setError(err)
    }
    setLoading(false);
  }

  const handleSearch = event => {
    event.preventDefault();
    getResults();
  }

  const handleClearSearch = () => {
    setQuery("");
    searchInputRef.current.focus();
  }

  return (
    <Fragment>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          onChange={event => setQuery(event.target.value)}
          value={query} 
          ref={searchInputRef}
        />
        <button 
          type="submit"
        >
          Search
        </button>
        <button 
          type="button"
          onClick={handleClearSearch}
        >
          Clear
        </button>
      </form>
      {loading ? (
        <div>Loading Results...</div>
      ) : (
        <ul>
          {results.map(result => (
            <li key={result.objectID}>
              <a href={result.url}>{result.title}</a>
            </li>
          ))}
        </ul>
      )}
      {error && <div>{error.message}</div>}
    </Fragment>
  );
}