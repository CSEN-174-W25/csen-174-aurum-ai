import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import './styles/navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            {/* Hamburger Menu */}
            <div className="navbar-left">
                <button className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                
                {/* Dropdown Menu */}
                <div className={`menu-dropdown ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" onClick={handleLinkClick}>Home</Link>
                    <Link to="/chat" onClick={handleLinkClick}>Chat</Link>
                    <Link to="/advice" onClick={handleLinkClick}>Advice</Link>
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