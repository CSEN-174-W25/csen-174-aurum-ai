import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import './styles/navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            {/* Hamburger Menu */}
            <div className="navbar-left">
                <button className="hamburger" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                
                {/* Dropdown Menu */}
                <div className={`menu-dropdown ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/">Home</Link>
                    <Link to="/chat">Chat</Link>
                    <Link to="/advice">Advice Pages</Link>
                    <Link to="/information">Information</Link>
                </div>
            </div>

            {/* Logo */}
            <div className="navbar-center">
                <Link to="/" className="logo">
                    AurumAI
                </Link>
            </div>

            {/* Profile Link */}
            <div className="navbar-right">
                <Link to="/profile" className="profile-link">
                    <UserRound />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;