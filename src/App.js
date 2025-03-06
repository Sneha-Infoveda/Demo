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
    const [showWelcome, setShowWelcome] = useState(true); // Welcome message state
    const [language, setLanguage] = useState("en"); // ✅ Add language state
    const [isGenerating, setIsGenerating] = useState(false); // ✅ Add isGenerating state

    // Hide welcome message when user sends a message
    useEffect(() => {
        if (chatHistory.length > 0) {
            setShowWelcome(false);
        }
    }, [chatHistory]);

    // Close sidebar when clicking outside
    const handleContentClick = () => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <Navbar onSearch={(query) => setQuery(query)} isSidebarOpen={isSidebarOpen} />
            <Sidebar setQuery={setQuery} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            {/* Display Welcome Message Before Chat Starts */}
            {showWelcome && (
                <div className="welcome-message">
                <h2>
                    ॐ असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्मा अमृतं गमय। ॐ शान्तिः शान्तिः शान्तिः ॥
                    <span role="img" aria-label="smile">🙏</span>
                </h2>
            
                <h3 className="sanskrit-text">
                    <i>- Om, Lead me from the unreal to the real,</i>
                </h3>
                <h3>
                    <i>Lead me from darkness to light,</i>
                </h3>
                <h3>
                    <i>Lead me from death to immortality.</i>
                </h3>
                <h3>
                    <i>May peace be, may peace be, may peace be.</i>
                </h3>
            </div>
            
            )}
            
            {/* Main Content */}
            <div className="main-content" onClick={handleContentClick}>
                <SearchBar 
                    query={query} 
                    setQuery={setQuery} 
                    setChatHistory={setChatHistory} 
                    language={language}  
                    setLanguage={setLanguage}
                    setIsGenerating={setIsGenerating} // ✅ Pass isGenerating function to SearchBar
                />
                <ChatContainer 
                    chatHistory={chatHistory} 
                    setQuery={setQuery} 
                    isGenerating={isGenerating} // ✅ Pass isGenerating state to ChatContainer
                />
            </div>
        </div>
    );
}

export default App;
