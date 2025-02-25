import React, { useState, useEffect } from 'react'; 
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import ChatContainer from './components/ChatContainer';
import './assets/styles.css';
import './assets/panel.css';

function App() {
    const [query, setQuery] = useState(""); // Track user input
    const [chatHistory, setChatHistory] = useState([]); // Store chat history
    const [showWelcome, setShowWelcome] = useState(true); // Welcome message state

    // Hide welcome message when user sends a message
    useEffect(() => {
        if (chatHistory.length > 0) {
            setShowWelcome(false);
        }
    }, [chatHistory]);

    return (
        <div>
            <Navbar />
            <Sidebar setQuery={setQuery} />
            
            {/* Display Welcome Message Before Chat Starts */}
            {showWelcome && (
                <div className="welcome-message">
                    <h2>
                        ॐ असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्मा अमृतं गमय।
                        <span role="img" aria-label="smile">🙏</span>
                    </h2>
                </div>
            )}

            
            <SearchBar query={query} setQuery={setQuery} setChatHistory={setChatHistory} />
            <ChatContainer chatHistory={chatHistory} setQuery={setQuery} />
        </div>
    );
}

export default App;
