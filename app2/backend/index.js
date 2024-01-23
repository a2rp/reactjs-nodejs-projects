require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 1198;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// console.log(stripe);
const cors = require("cors");

const storedItems = [
    { id: 1, name: "Item One", price: 123 },
    { id: 2, name: "Item Two", price: 456 },
];

app.use(cors({ origin: ["http://localhost:3000"] }));
app.use(express.json());

app.post("/api/make-payment", async (req, res) => {
    const data = req.body;
    console.log(data, "req.body");
    try {
        const lineItems = data.map(item => {
            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name
                    },
                    unit_amount: storedItems.find(o => o.name.toLocaleLowerCase() === item.name.toLocaleLowerCase()).price * 100
                },
                quantity: item.quantity
            };
        });
        const response = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            success_url: `${process.env.CLIENT_URL}`,
            cancel_url: `${process.env.CLIENT_URL}`,
        });
        res.json({ success: true, message: "Payment successful", url: response.url });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT} - http://localhost:${PORT}`);
});

