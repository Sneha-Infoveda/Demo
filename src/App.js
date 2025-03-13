import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import ChatContainer from './components/ChatContainer';
import SocketService from "./components/SocketService"; // Note the double-dot path
import './assets/styles.css';
import './assets/panel.css';

function App() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [language, setLanguage] = useState("en");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");

  // Get the socket instance from SocketService.
  const socket = SocketService.getSocket();

  // Set up the streaming listener if the socket is valid.
  useEffect(() => {
    if (socket && typeof socket.on === "function") {
      socket.on("streamingData", (data) => {
        setStreamingMessage((prev) => prev + data);
      });
      return () => {
        socket.off("streamingData");
      };
    } else {
      console.error("Socket is not properly initialized:", socket);
    }
  }, [socket]);

  // Hide welcome message once there are chat messages.
  useEffect(() => {
    if (chatHistory.length > 0) {
      setShowWelcome(false);
    }
  }, [chatHistory]);

  const handleSpeechOutput = (message) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-US";
    synth.speak(utterance);
  };

  const sendMessage = async (messageText) => {
    if (isGenerating) {
      console.log("A request is already in progress. Please wait.");
      return;
    }
    setChatHistory((prev) => [
      ...prev,
      { isUser: true, text: messageText }
    ]);
    setIsGenerating(true);
    setStreamingMessage("");

    try {
      const response = await fetch("https://chatveda.onrender.com/get_answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: messageText, language })
      });
      const data = await response.json();
      setChatHistory((prev) => [
        ...prev,
        {
          isUser: false,
          text: streamingMessage || data.response,
          followUpQuestions: data.follow_up_questions || []
        }
      ]);
      handleSpeechOutput(data.response);
    } catch (error) {
      console.error("Error fetching response:", error);
      setChatHistory((prev) => [
        ...prev,
        { isUser: false, text: `Error: ${error.message}` }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContentClick = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar onSearch={(q) => sendMessage(q)} isSidebarOpen={isSidebarOpen} />
      <Sidebar sendMessage={sendMessage} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      {showWelcome && (
        <div className="welcome-message">
          <h2>
            ॐ असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्मा अमृतं गमय। ॐ शान्तिः शान्तिः शान्तिः ॥
            <span role="img" aria-label="smile">🙏</span>
          </h2>
          <h3 className="sanskrit-text"><i>- Om, Lead me from the unreal to the real,</i></h3>
          <h3><i>Lead me from darkness to light,</i></h3>
          <h3><i>Lead me from death to immortality.</i></h3>
          <h3><i>May peace be, may peace be, may peace be.</i></h3>
        </div>
      )}
      <div className="main-content" onClick={handleContentClick}>
        <SearchBar
          query={query}
          setQuery={setQuery}
          sendMessage={sendMessage}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          language={language}
          setLanguage={setLanguage}
          setIsGenerating={setIsGenerating}
        />
        <ChatContainer chatHistory={chatHistory} isGenerating={isGenerating} sendMessage={sendMessage} />
      </div>
    </div>
  );
}

export default App;
