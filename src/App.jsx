import React, {useState} from 'react'; 
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import ChatContainer from './components/ChatContainer';
import './assets/styles.css';
import './assets/panel.css';

function App() {
    const [query, setQuery] = useState("");
    return (
        <div>
            <Navbar />
            <Sidebar setQuery={setQuery} /> {/* Pass setQuery to Sidebar */}
            <SearchBar query={query} setQuery={setQuery} /> {/* Pass query and setQuery to SearchBar */}
            <ChatContainer />
        </div>
    );
}

export default App;
