import React, { useState } from 'react';

const SearchBar = ({query, setQuery}) => {

    const handleSearch = async () => {
        console.log("User asked:", query);
        // You can send this query to Flask API here
    };

    return (
        <div className="search-bar">
            <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Ask ChatVeda"
            />
            
            <div className="icons">
                <button onClick={handleSearch}><i className="fas fa-search"></i></button>
                <button><i className="fas fa-paperclip"></i></button>
            </div>
        </div>
    );
};

export default SearchBar;
