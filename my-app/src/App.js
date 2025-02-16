import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import ChatInterface from './components/SampleChatInterface';
import Chat from './components/Chat';

function App() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>The current time is {time}</p>
        
        {/* Display chat interface */}
        <ChatInterface />
        <Chat />  {/* Add Chat Component Here */}
      </header>
    </div>
  );
}

export default App;