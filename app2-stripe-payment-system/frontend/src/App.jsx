import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1198/api";
const products = [
    { id: 1, name: "Item One", price: 123 },
    { id: 2, name: "Item Two", price: 456 },
];

export default function App() {
    const [quantities, setQuantities] = useState({ 1: 0, 2: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const checkoutStatus = params.get("checkout");
        const sessionId = params.get("session_id");

        if (checkoutStatus === "cancel") {
            setMessage("Checkout was cancelled. Your cart is still available.");
            window.history.replaceState({}, "", window.location.pathname);
            return;
        }
        if (checkoutStatus !== "success" || !sessionId) return;

        let active = true;
        setMessage("Checking payment status…");
        axios.get(`${API_BASE_URL}/checkout-session/${encodeURIComponent(sessionId)}`)
            .then(({ data }) => {
                if (active) {
                    setMessage(data.paymentStatus === "paid"
                        ? "Stripe confirms this Checkout payment is paid."
                        : `Checkout status: ${data.paymentStatus || data.status || "pending"}.`);
                }
            })
            .catch(() => {
                if (active) setMessage("Could not verify the Checkout Session. Check the Stripe test dashboard.");
            })
            .finally(() => window.history.replaceState({}, "", window.location.pathname));

        return () => { active = false; };
    }, []);

    const updateQuantity = (id, value) => {
        setQuantities((current) => ({ ...current, [id]: Number(value) }));
    };

    const makePayment = async () => {
        const items = products
            .filter((product) => quantities[product.id] > 0)
            .map((product) => ({ id: product.id, quantity: quantities[product.id] }));

        if (items.length === 0) {
            setMessage("Select at least one item quantity.");
            return;
        }

        setIsLoading(true);
        setMessage("");
        try {
            const response = await axios.post(`${API_BASE_URL}/make-payment`, { items });
            if (!response.data?.url) throw new Error("Checkout did not return a redirect URL.");
            window.location.assign(response.data.url);
        } catch (error) {
            setMessage(error.response?.data?.error || error.message || "Could not start Stripe Checkout.");
            setIsLoading(false);
        }
    };

    const total = products.reduce((sum, product) => sum + product.price * quantities[product.id], 0);

    return (
        <main style={{ maxWidth: 900, margin: "48px auto", padding: 24, fontFamily: "Arial, sans-serif" }}>
            <h1>Stripe Checkout demo</h1>
            <p>Choose test products. Prices are checked by the backend.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                {products.map((product) => (
                    <section key={product.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 20 }}>
                        <h2>{product.name}</h2>
                        <p>₹{product.price} each</p>
                        <label htmlFor={`quantity-${product.id}`}>Quantity</label>{" "}
                        <select
                            id={`quantity-${product.id}`}
                            value={quantities[product.id]}
                            onChange={(event) => updateQuantity(product.id, event.target.value)}
                        >
                            <option value={0}>0</option>
                            {[1, 2, 3].map((quantity) => <option key={quantity} value={quantity}>{quantity}</option>)}
                        </select>
                    </section>
                ))}
            </div>
            <p>Total: ₹{total}</p>
            <button type="button" onClick={makePayment} disabled={isLoading}>
                {isLoading ? "Opening secure checkout…" : "Continue to Stripe Checkout"}
            </button>
            {message && <p role="status" aria-live="polite">{message}</p>}
        </main>
    );
}
