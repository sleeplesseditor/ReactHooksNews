import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

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
      console.log(response.data.hits);
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
    <div className="container w-1/2 mx-auto p-4 bg-gray-100 rounded">
      <img 
        src="https://icon.now.sh/react/c0c" 
        alt="React Logo" 
        className="float-right h-12"
      />
      <h1 className="text-3xl">
        Hooks News
      </h1>
      <form 
        onSubmit={handleSearch}
        className="mb-2"
      >
        <input 
          type="text" 
          onChange={event => setQuery(event.target.value)}
          value={query} 
          ref={searchInputRef}
          className="border p-1 rounded"
        />
        <button 
          type="submit"
          className="bg-blue-500 m-1 p-1 text-white rounded hover:bg-blue-400"
        >
          Search
        </button>
        <button 
          type="button"
          onClick={handleClearSearch}
          className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
        >
          Clear
        </button>
      </form>
      {loading ? (
        <div className="font-bold text-gray-dark">
          Loading Results...
        </div>
      ) : (
        <ul className="list-reset leading-normal">
          {results.map(result => (
            <li key={result.objectID}>
              <a 
                className="text-darkest-gray hover:text-gray-500 leading-loose"
                href={result.url}>
                  {result.title}
              </a>
              <p className="float-right">{result.points} pts</p>
            </li>
          ))}
        </ul>
      )}
      {error && <div className="text-red font-bold">
        {error.message}
      </div>}
    </div>
  );
}