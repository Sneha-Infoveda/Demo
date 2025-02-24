import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatContainer.css'; // Import styles

const ChatContainer = ({ chatHistory, setQuery }) => {
    const chatEndRef = useRef(null);

    // Auto-scroll to the bottom when chat updates
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatHistory]);

    // Hide chat container if no messages
    if (chatHistory.length === 0) return null;

    return (
        <div className="chat-container">
            {chatHistory.map((chat, index) => (
                <div key={index} className={`chat-message ${chat.isUser ? 'user' : 'bot'}`}>
                    <div className="message-bubble">
                        <ReactMarkdown>{chat.text}</ReactMarkdown>
                    </div>

                    {/* Display follow-up questions only for bot responses */}
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
            {/* Empty div for auto-scroll to bottom */}
            <div ref={chatEndRef} />
        </div>
    );
};

export default ChatContainer;
