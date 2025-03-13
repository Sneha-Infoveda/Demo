import React, { useEffect, useRef, useState } from "react";
import VoiceAssistant from "./VoiceAssistant";
import SocketService from "./SocketService"; // Note the double-dot path
import "./ChatContainer.css";

const ChatContainer = ({ chatHistory, isGenerating, sendMessage }) => {
  const chatContainerRef = useRef(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  const socket = SocketService.getSocket();

  // Auto-scroll when chat history, isGenerating, or streamingMessage changes.
  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, 100);
    }
  }, [chatHistory, isGenerating, streamingMessage]);

  // Set up real-time streaming listener, if the socket exists.
  useEffect(() => {
    if (socket && typeof socket.on === "function") {
      socket.on("streamingData", (data) => {
        setStreamingMessage((prev) => prev + data);
      });

      return () => {
        if (socket && typeof socket.off === "function") {
          socket.off("streamingData");
        }
      };
    }
  }, [socket]);

  if (!chatHistory || chatHistory.length === 0) return null;

  return (
    <div className="chat-container" ref={chatContainerRef}>
      {chatHistory.map((chat, index) => (
        <div key={index} className={`chat-message ${chat.isUser ? "user" : "bot"}`}>
          <p className="message-sender">{chat.isUser ? "Seeker" : "ChatVeda"}</p>
          <div className="message-bubble">
            <div dangerouslySetInnerHTML={{ __html: chat.text }} />
            {!chat.isUser && (
              <VoiceAssistant textToRead={chat.text.replace(/<[^>]+>/g, "")} />
            )}
          </div>
          {!chat.isUser && chat.followUpQuestions && chat.followUpQuestions.length > 0 && (
            <div className="followup-questions">
              <p>Follow-up Questions:</p>
              {chat.followUpQuestions.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {streamingMessage && (
        <div className="chat-message bot">
          <p className="message-sender">ChatVeda</p>
          <div className="message-bubble">{streamingMessage}</div>
        </div>
      )}

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
