import React from 'react';
import ChatInterface from '../components/chatInterface';
import './styles/Chat.css';

// Navbar
import Navbar from "./components/navbar";

const Chat = () => {
    return (
        <>
            <Navbar />
            <h1>Chat</h1>
            <ChatInterface />
        </>
    );
};

export default Chat;