import React, { useState } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";

function VoiceAssistant({ textToRead }) {
    const [isReading, setIsReading] = useState(false);  // Track reading state

    // Start or Stop Reading
    const toggleReading = () => {
        const synth = window.speechSynthesis;

        if (isReading) {
            synth.cancel(); // Stop reading
            setIsReading(false);
        } else if (textToRead) { // Start reading only if there's text to read
            // Strip HTML tags before reading
            const plainText = textToRead.replace(/<[^>]+>/g, "");
            const utterance = new SpeechSynthesisUtterance(plainText);
            utterance.lang = "en-US";

            // Handle end of speech to update button state
            utterance.onend = () => {
                setIsReading(false);
            };

            // Start reading
            synth.speak(utterance);
            setIsReading(true);
        }
    };

    return (
        <button onClick={toggleReading} className="voice-btn">
            {isReading ? <FaStop size={24} /> : <FaMicrophone size={24} />}
        </button>
    );
}

export default VoiceAssistant;
