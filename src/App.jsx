import React from 'react'; 
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import ChatContainer from './components/ChatContainer';
import './assets/styles.css';
import './assets/panel.css';

function App() {
    return (
        <div>
            <Navbar />
            <Sidebar />
            <SearchBar />
            <ChatContainer />
        </div>
    );
}

export default App;
