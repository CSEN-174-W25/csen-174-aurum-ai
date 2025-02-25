const API_URL = "http://localhost:5001";  // Flask API

export async function sendMessageToAI(prompt) {
    try {
        const response = await fetch(`${API_URL}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error communicating with AI:", error);
        return null;
    }
}
