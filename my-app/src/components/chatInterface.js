import React from "react";
import axios from "axios";

import { Send, Trash2 } from "lucide-react"; // ✅ Import Trash icon
import "../pages/styles/Chat.css";

class ChatInterface extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            context: JSON.parse(localStorage.getItem("chatHistory")) || [], // ✅ Load from localStorage
            prompt: "",
        };
        this.messagesEndRef = React.createRef(); // ✅ Ref for auto-scrolling
    }

    /* ✅ Scroll to bottom whenever a new message is added */
    scrollToBottom = () => {
        if (this.messagesEndRef.current) {
            this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    componentDidUpdate() {
        this.scrollToBottom();
    }

    /* ✅ Function to clear chat history */
    clearChat = () => {
        this.setState({ context: [] });
        localStorage.removeItem("chatHistory");
    };

    fetchChatResponse = async (event) => {
        event.preventDefault();
        const { prompt } = this.state;
        let context = Array.isArray(this.state.context) ? [...this.state.context] : [];
        const { userData } = this.props;

        if (!prompt.trim()) return;

        // ✅ Append user message and save history
        const updatedContext = [...context, { role: "user", content: prompt }];
        this.setState({ context: updatedContext, prompt: "" });
        localStorage.setItem("chatHistory", JSON.stringify(updatedContext)); // Save chat history

        try {
            const response = await axios.post("http://localhost:5001/", {
                prompt,
                context: updatedContext,
                userData,
            });

            if (response.data && Array.isArray(response.data.context)) {
                // ✅ Find latest assistant response
                const lastAssistantMessage = response.data.context.find(msg => msg.role === "assistant");
                if (lastAssistantMessage) {
                    const formattedResponse = this.formatMessage(lastAssistantMessage.content);

                    const finalContext = [...updatedContext, { role: "assistant", content: formattedResponse }];
                    this.setState({ context: finalContext });

                    // ✅ Save updated chat history
                    localStorage.setItem("chatHistory", JSON.stringify(finalContext));
                }
            } else {
                console.error("Invalid API response format:", response.data);
            }

        } catch (error) {
            console.error("🚨 Error fetching response:", error);
        }
    };

    formatMessage = (message) => {
        return message
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")  // Convert **bold** to <strong>
            .replace(/\n/g, "<br />"); // Convert \n to <br>
        };

    render() {
        return (
            <>
                <div className="convo-wrapper">
                    <h3>Ask Anything to AurumAI</h3>
                    <ul className="convo">
                        {Array.isArray(this.state.context) ? (
                            this.state.context
                                .filter(cntx => cntx.role !== "system")
                                .map((cntx, idx) => (
                                    <li className="dialogues" key={idx}>
                                        {" "}
                                        {cntx.content ? (
                                            <span dangerouslySetInnerHTML={{ __html: cntx.content }} />
                                        ) : (
                                            "Message could not be displayed."
                                        )}
                                    </li>
                                ))
                        ) : (
                            <li className="dialogues">No conversation history available.</li>
                        )}
                        <div ref={this.messagesEndRef} /> {/* ✅ Auto-scroll anchor */}
                    </ul>
                </div>

                {/* ✅ Chat Input and Buttons */}
                <form className="chat-form" onSubmit={this.fetchChatResponse}>
                    <input
                        className="chat-input"
                        type="text"
                        value={this.state.prompt}
                        onChange={(e) => this.setState({ prompt: e.target.value })}
                        placeholder="Type your message..."
                        required
                    />
                    
                    {/* ✅ Clear Chat Button */}
                    <button type="button" className="clear-button" onClick={this.clearChat}>
                        <Trash2 />
                    </button>

                    {/* ✅ Send Message Button */}
                    <button type="submit" className="submit-button">
                        <Send />
                    </button>
                </form>
            </>
        );
    }
}

export default ChatInterface;