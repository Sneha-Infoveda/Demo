import React, { useState } from 'react';

const Navbar = () => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    return (
        <nav className="navbar">
            <ul className="nav-menu">
                <li className="nav-item">
                    <button className="nav-button" onClick={() => toggleDropdown('education')}>
                        Education
                    </button>
                    {openDropdown === 'education' && (
                        <ul className="dropdown">
                            <li><a href="#">History of Education</a></li>
                            <li><a href="#">Modern Education System</a></li>
                            <li><a href="#">Vedic Education</a></li>
                        </ul>
                    )}
                </li>
                <li className="nav-item">
                    <button className="nav-button" onClick={() => toggleDropdown('religious')}>
                        Religious
                    </button>
                    {openDropdown === 'religious' && (
                        <ul className="dropdown">
                            <li><a href="#">Hinduism</a></li>
                            <li><a href="#">Buddhism</a></li>
                        </ul>
                    )}
                </li>
                <li className="nav-item">
                    <button className="nav-button" onClick={() => toggleDropdown('history')}>
                        History
                    </button>
                    {openDropdown === 'history' && (
                        <ul className="dropdown">
                            <li><a href="#">Ancient History</a></li>
                            <li><a href="#">Medieval History</a></li>
                        </ul>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
