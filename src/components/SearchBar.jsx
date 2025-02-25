import React, { useState, useEffect } from 'react';
import './SearchBar.css'; 

const SearchBar = ({ query, setQuery, setChatHistory }) => {
    const [loading, setLoading] = useState(false);

    // Automatically trigger search when query changes
    useEffect(() => {
        if (query) {
            handleSearch();
        }
    }, [query]);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);

        // Add user message to chat history
        setChatHistory(prevChat => [
            ...prevChat,
            { text: query, isUser: true }
        ]);

        try {
            const res = await fetch("http://127.0.0.1:5000/get_answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: query })
            });

            const data = await res.json();

            // Add bot response to chat history
            setChatHistory(prevChat => [
                ...prevChat,
                { text: data.response, isUser: false, followUpQuestions: data.follow_up_questions || [] }
            ]);

            setQuery(""); // Clear input field after sending
        } catch (error) {
            console.error("Error fetching response:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-bar">
            <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Type a message..."
            />
            <button onClick={handleSearch} disabled={loading}>
                {loading ? "Thinking..." : <i className="fas fa-paper-plane"></i>}
            </button>
        </div>
    );
};

export default SearchBar;
