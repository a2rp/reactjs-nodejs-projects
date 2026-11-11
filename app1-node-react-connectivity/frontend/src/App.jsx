import React, { useState } from 'react'
import axios from 'axios'

const App = () => {
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1198/api";

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("Click the button to fetch a message from the API.");

    const getMessage = async () => {
        try {
            const config = {
                url: "/a2rp",
                method: "GET"
            };

            setIsLoading(true);
            const response = await axios(config);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Could not connect to the backend. Check that it is running.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ marginTop: "50px", textAlign: "center" }}>
            <h1>app1</h1>
            Hello World!
            <div style={{ marginTop: "15px" }}>
                <button type="button" onClick={getMessage} disabled={isLoading}>
                    {isLoading ? "Loading…" : "Get message from backend"}
                </button>
            </div>
            <div style={{ marginTop: "15px" }} aria-live="polite">
                {message} <button type="button" onClick={() => setMessage("Click the button to fetch a message from the API.")}>Clear message</button>
            </div>
        </div>
    )
}

export default App
