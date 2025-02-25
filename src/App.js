// App.js
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Track sidebar state

    // Add welcome message when the app loads
    useEffect(() => {
        setChatHistory([
            { text: "Hello! How can I help you today? 😊", isUser: false }
        ]);
    }, []);

    // Close sidebar when clicking outside
    const handleContentClick = () => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            {/* Pass isSidebarOpen as a prop */}
            <Navbar onSearch={(query) => setQuery(query)} isSidebarOpen={isSidebarOpen} />
            <Sidebar setQuery={setQuery} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
           

            
            {/* Main Content */}
            <div className="main-content" onClick={handleContentClick}>
                <SearchBar query={query} setQuery={setQuery} setChatHistory={setChatHistory} />
                <ChatContainer chatHistory={chatHistory} setQuery={setQuery} />
            </div>
        </div>
    );
}

export default App;
