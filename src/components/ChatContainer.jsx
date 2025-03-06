import React, { useEffect, useRef } from "react";
import "./ChatContainer.css"; // Import styles

const ChatContainer = ({ chatHistory, isGenerating, setQuery }) => {
    const chatContainerRef = useRef(null);

    // Auto-scroll to the bottom when chat updates
    useEffect(() => {
        if (chatContainerRef.current) {
            setTimeout(() => {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }, 100); // Small delay ensures DOM is updated
        }
    }, [chatHistory, isGenerating]);

    // Hide chat container if no messages
    if (!chatHistory || chatHistory.length === 0) return null;

    return (
        <div className="chat-container" ref={chatContainerRef}>
            {chatHistory.map((chat, index) => (
                <div key={index} className={`chat-message ${chat.isUser ? "user" : "bot"}`}>
                    <p className="message-sender">{chat.isUser ? "Seeker" : "ChatVeda"}</p>
                    <div className="message-bubble" dangerouslySetInnerHTML={{ __html: chat.text }} />
                    {!chat.isUser && chat.followUpQuestions?.length > 0 && (
                        <div className="followup-questions">
                            {chat.followUpQuestions.map((q, i) => (
                                <button key={i} onClick={() => setQuery(q)}>
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {/* ✅ Show "Generating answer..." message when waiting for response */}
            {isGenerating && (
                <div className="chat-message bot">
                    <p className="message-sender">ChatVeda</p>
                    <div className="message-bubble">Generating answer, please wait...</div>
                </div>
            )}
        </div>
    );
};

export default ChatContainer;
