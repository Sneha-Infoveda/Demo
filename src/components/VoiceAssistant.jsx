import React, { useState, useEffect } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";

function VoiceAssistant({ textToRead }) {
    const [isReading, setIsReading] = useState(false);
    const [voices, setVoices] = useState([]);

    // Load available voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                // Filter for only male voices with desired languages
                const filteredVoices = availableVoices.filter(voice =>
                    (voice.lang === "en-IN" || voice.lang === "hi-IN" || voice.lang === "mr-IN") &&
                    !voice.name.toLowerCase().includes("female") // Exclude female voices
                );
                setVoices(filteredVoices);
                console.log("Loaded voices:", filteredVoices);
            }
        };

        // Load voices when they change
        window.speechSynthesis.onvoiceschanged = loadVoices;
        // Try loading voices immediately as well (in case they are already loaded)
        loadVoices();
    }, []);

    // Language detection (basic)
    const detectLanguage = (text) => {
        const hindiPattern = /[अ-ह]/;
        const marathiPattern = /[अ-ह]/; // Marathi also uses Devanagari script
        if (marathiPattern.test(text)) return "mr-IN";
        if (hindiPattern.test(text)) return "hi-IN";
        return "en-IN"; // Default to Indian English
    };

    const toggleReading = () => {
        const synth = window.speechSynthesis;

        if (isReading) {
            synth.cancel(); // Stop reading
            setIsReading(false);
        } else if (textToRead) {
            // Check if voices are loaded
            if (voices.length === 0) {
                console.warn("Voices not loaded yet!");
                return;
            }

            // Strip HTML tags before reading
            const plainText = textToRead.replace(/<[^>]+>/g, "");
            const language = detectLanguage(plainText);

            const utterance = new SpeechSynthesisUtterance(plainText);
            utterance.lang = language;

            // Adjust parameters for a pleasant male tone
            utterance.rate = 0.85;
            utterance.pitch = 1.4;

            // Find a preferred male voice based on the language
            const maleVoice = voices.find(voice => voice.lang === language);

            // Fallback to the first available male voice if no match is found
            utterance.voice = maleVoice || voices[0];

            console.log("Selected voice:", utterance.voice.name);

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
