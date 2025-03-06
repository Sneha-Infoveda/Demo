import React, { useState } from 'react';

const Navbar = ({ onSearch }) => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    const handleItemClick = (text) => {
        if (onSearch) {
            onSearch(text); 
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
               <div className='logo'> <img src="/logocropped.jpg" alt="ChatVeda AI Logo" className="logo" /></div>
                <ul className="nav-menu">
                    <li className="nav-item">
                        <button className="nav-button" onClick={() => toggleDropdown('education')}>
                            Education
                        </button>
                        {openDropdown === 'education' && (
                            <ul className="dropdown">
                                <li><button onClick={() => handleItemClick('Atharveda')}>Atharveda</button></li>
                                <li><button onClick={() => handleItemClick('Samveda')}>Samveda</button></li>
                                <li><button onClick={() => handleItemClick('Yajurveda')}>Yajurveda</button></li>
                                <li><button onClick={() => handleItemClick('Rigveda')}>Rigveda</button></li>
                                <li><button onClick={() => handleItemClick('Shivpuran')}>Shivpuran</button></li>
                                <li><button onClick={() => handleItemClick('Agnipuran')}>Agnipuran</button></li>
                                <li><button onClick={() => handleItemClick('Garudpuran')}>Garudpuran</button></li>
                                <li><button onClick={() => handleItemClick('Brahmapuran')}>Brahmapuran</button></li>
                                <li><button onClick={() => handleItemClick('Bhagvat Puran')}>Bhagvat Puran</button></li>
                            </ul>
                        )}
                    </li>
                    <li className="nav-item">
                        <button className="nav-button" onClick={() => toggleDropdown('religious')}>
                            Religious
                        </button>
                        {openDropdown === 'religious' && (
                            <ul className="dropdown">
                                <li><button onClick={() => handleItemClick('Bhagvad Gita')}>Bhagvad Gita</button></li>
                                <li><button onClick={() => handleItemClick('Ram charit Manas')}>Ram charit Manas</button></li>
                            </ul>
                        )}
                    </li>
                    <li className="nav-item">
                        <button className="nav-button" onClick={() => toggleDropdown('history')}>
                            History
                        </button>
                        {openDropdown === 'history' && (
                            <ul className="dropdown">
                                <li><button onClick={() => handleItemClick('Ramayana')}>Ramayana</button></li>
                                <li><button onClick={() => handleItemClick('Mahabharta')}>Mahabharta</button></li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
