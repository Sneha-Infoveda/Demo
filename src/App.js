import React, { useState } from 'react'; 
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import ChatContainer from './components/ChatContainer';
import './assets/styles.css';
import './assets/panel.css';

function App() {
    const [query, setQuery] = useState(""); // Track user input
    const [chatHistory, setChatHistory] = useState([]); // Store chat history

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
