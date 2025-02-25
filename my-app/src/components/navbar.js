import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/analytics">Analytics</Link>
                    <Link to="/settings">Settings</Link>
                </div>
            </div>

            {/* Logo */}
            <div className="navbar-center">
                <Link to="/" className="logo">
                    LOGO
                </Link>
            </div>

            {/* Profile Link */}
            <div className="navbar-right">
                <Link to="/profile" className="profile-link">
                    My Profile
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;