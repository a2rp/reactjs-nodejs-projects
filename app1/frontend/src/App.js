import React, { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
    axios.defaults.baseURL = "http://localhost:1198/api";

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("message");

    const getMessage = async () => {
        try {
            const config = {
                url: "/a2rp",
                method: "GET"
            };

            setIsLoading(true);
            const response = await axios(config);
            console.log(response);
            setMessage(response.data.message);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ marginTop: "50px", textAlign: "center" }}>
            <h1>app1</h1>
            Hello World!
            <div style={{ marginTop: "15px" }}>
                <button onClick={getMessage} disabled={isLoading}>
                    click here to receive message from backend {setIsLoading === true ? "Loading" : ""}
                </button>
            </div>
            <div style={{ marginTop: "15px" }}>
                {message} <button onClick={() => setMessage("click the button above to receive message from backend")}>clear message</button>
            </div>
        </div>
    )
}

export default App
