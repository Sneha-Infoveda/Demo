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

    // Add welcome message when the app loads
    useEffect(() => {
        setChatHistory([
            { text: "Hello! How can I help you today? 😊", isUser: false }
        ]);
    }, []);

    return (
        <div>
            <Navbar />
            <Sidebar setQuery={setQuery} />
            <SearchBar query={query} setQuery={setQuery} setChatHistory={setChatHistory} />
            <ChatContainer chatHistory={chatHistory} setQuery={setQuery} />
        </div>
    );
}

export default App;
