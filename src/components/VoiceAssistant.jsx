import React, { useState, useEffect } from "react";
import { FaVolumeUp, FaStop } from "react-icons/fa";  // Changed icon to speaker

function VoiceAssistant({ textToRead }) {
  const [isReading, setIsReading] = useState(false);
  const [voices, setVoices] = useState([]);
  const synth = window.speechSynthesis;

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      if (availableVoices.length > 0) {
        const filteredVoices = availableVoices
          .filter((voice) => voice.lang === "en-IN")
          .sort((a, b) => a.name.localeCompare(b.name));
        setVoices(filteredVoices);
        console.log("Loaded voices:", filteredVoices);
      }
    };

    // Load voices initially
    loadVoices();

    // Attach the event listener only once if available
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
    // We disable exhaustive-deps because synth is a stable global object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clean and format the text for better pronunciation
  const cleanText = (text) => {
    // Create a RegExp using the constructor to avoid unnecessary escapes.
    // This regex will match any of the following characters: ] [ / \ # @ * ~ ^ _ ` | < > { } ( )
    const regex = new RegExp("[][\\/\\\\#@*~^_`|<>{}()]", "g");
    return text
      .replace(/<[^>]+>/g, "")       // Remove HTML tags
      .replace(regex, "")            // Remove unnecessary symbols
      .replace(/(\r\n|\n|\r)/gm, " ") // Replace line breaks with spaces
      .replace(/[.,!?:;]+/g, ".");    // Normalize punctuation to full stops
  };

  // Toggle reading function
  const toggleReading = () => {
    if (isReading) {
      synth.cancel(); // Stop speaking
      setIsReading(false);
      return;
    }

    if (textToRead) {
      const plainText = cleanText(textToRead);

      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.lang = "en-IN"; // Set language to Indian English
      utterance.rate = 0.95;    // Slightly slower for clarity
      utterance.pitch = 1.4;
    

      const indianVoice = voices.find((voice) => voice.lang === "en-IN") || voices[0];
      utterance.voice = indianVoice;

      utterance.onend = () => {
        setIsReading(false);
      };

      synth.speak(utterance);
      setIsReading(true);
    }
  };

  return (
    <button onClick={toggleReading} className={`voice-btn ${isReading ? "active" : ""}`}>
      {isReading ? <FaStop size={24} /> : <FaVolumeUp size={24} />}
    </button>
  );
}

export default VoiceAssistant;
