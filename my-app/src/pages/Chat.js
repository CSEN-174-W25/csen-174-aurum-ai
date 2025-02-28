import React from 'react';
import ChatInterface from '../components/chatInterface';
import './styles/Chat.css';

const Chat = () => {
    return (
        <div className="chat-container">
            <div className="chat-interface-wrapper">
                <ChatInterface />
            </div>
        </div>
    );
};

export default Chat;