import React, { useState } from 'react';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const togglePanel = () => setIsOpen(!isOpen);

    const questions = [
        "What are the four Vedas?",
        "Dharma, Karma and Moksha?",
        "What are the stages of life?",
        "How many Puranas?",
        "Concept and types of Vimanas?",
        "Types of Weapons in Atharvaved?",
        "Astrology and its key concepts?",
        "Metallurgy as per Vedas?",
        "Astronomy as per Vedas?",
        "Dharma in Puranas?",
        "Concept of ‘Shunya’ or Zero?",
        "Rituals and its significance?",
        "Geometrical concepts in Vedas?",
        "Puranas and kingship?"
    ];

    return (
        <div className={`side-panel ${isOpen ? 'open' : ''}`}>
            <div className="icons">
                <img src="/static/imag/logocropped.jpg" alt="ChatVeda AI Logo" className="logo" />
                <button className="toggle-btn" onClick={togglePanel}>☰</button>
            </div>
            <ul className="conversation-list">
                {questions.map((question, index) => (
                    <li key={index}>{question}</li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
