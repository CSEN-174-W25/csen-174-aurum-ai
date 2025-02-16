import React, { useState } from "react";
import { sendMessageToAI } from "../api/chat";

const Chat = () => {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");

    const handleSend = async () => {
        const aiResponse = await sendMessageToAI(input);
        setResponse(aiResponse ? aiResponse.message : "Error getting response");
    };

    return (
        <div>
            <h1>AI Financial Assistant</h1>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
            <button onClick={handleSend}>Send</button>
            <p><strong>AI Response:</strong> {response}</p>
        </div>
    );
};

export default Chat;
