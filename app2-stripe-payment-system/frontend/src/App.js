import React, { useState } from "react"
import axios from "axios";

const App = () => {
    axios.defaults.baseURL = "http://localhost:1198/api";

    const [isLoading, setIsLoading] = useState(false);
    const [item1, setItem1] = useState(0);
    const [item2, setItem2] = useState(0);
    const [amount, setAmount] = useState(0);

    const makePayment = async () => {
        console.log(item1, item2);
        if (parseInt(item1) === 0 && parseInt(item2) === 0) {
            return alert("Select at least one item quantity");
        }
        const data = [];
        if (item1 !== 0) {
            data.push({ id: 1, name: "Item One", quantity: item1 });
        }
        if (item2 !== 0) {
            data.push({ id: 2, name: "Item Two", quantity: item2 });
        }
        try {
            const config = {
                method: "POST",
                url: "/make-payment",
                data
            };
            setIsLoading(true);
            const response = await axios(config);
            console.log(response);
            if (response.data.success) {
                window.location = response.data.url;
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: "15px" }}>
            <div style={{ display: "flex", gap: "30px" }}>
                <div>
                    <img src="https://source.unsplash.com/user/c_v_r/300x200" alt="" />
                    <br />
                    Item One <br />
                    Price: Rs. 123
                    <br />
                    <select name="select1" id="select1" value={item1} onChange={event => setItem1(event.target.value)}>
                        <option value="0">Select Quantity</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
                <div>
                    <img src="https://source.unsplash.com/user/c_v_r/301x200" alt="" />
                    <br />
                    Item Two <br />
                    price: Rs. 456
                    <br />
                    <select name="select1" id="select1" value={item2} onChange={event => setItem2(event.target.value)}>
                        <option value="0">Select Quantity</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
            </div>
            <hr />
            <div>
                <input
                    type="button"
                    value="Make payment"
                    onClick={makePayment}
                />
            </div>
        </div>
    )
}

export default App
