import React, { useState } from 'react';
import './SearchBar.css'; // Import styles

const SearchBar = ({ query, setQuery, setChatHistory }) => {
    const [loading, setLoading] = useState(false); // Show loading state

    const handleSearch = async () => {
        if (!query.trim()) return; // Prevent empty requests
        setLoading(true);

        try {
            const res = await fetch("http://127.0.0.1:5000/get_answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: query }) // Send question to Flask
            });

            const data = await res.json();
            
            setChatHistory(prevChat => [
                ...prevChat,
                { question: query, response: data.response, followUpQuestions: data.follow_up_questions || [], isUser: true },
                { response: data.response, followUpQuestions: data.follow_up_questions || [], isUser: false }
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
