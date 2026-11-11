require("dotenv").config();

const cors = require("cors");
const express = require("express");
const stripe = process.env.STRIPE_SECRET_KEY
    ? require("stripe")(process.env.STRIPE_SECRET_KEY)
    : null;
const app = express();
const PORT = process.env.PORT || 1198;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const CLIENT_ORIGIN = new URL(CLIENT_URL).origin;
const CATALOG = new Map([
    [1, { name: "Item One", unitAmount: 12300 }],
    [2, { name: "Item Two", unitAmount: 45600 }],
]);

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || CLIENT_ORIGIN }));

app.post("/api/webhooks/stripe", express.raw({ type: "application/json", limit: "1mb" }), (req, res) => {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
        return res.status(503).json({ error: "Stripe webhook verification is not configured." });
    }

    try {
        stripe.webhooks.constructEvent(
            req.body,
            req.get("stripe-signature"),
            process.env.STRIPE_WEBHOOK_SECRET
        );
        // This example validates and acknowledges events but has no durable order store or fulfillment.
        return res.status(200).json({ received: true });
    } catch {
        return res.status(400).json({ error: "Webhook signature could not be verified." });
    }
});

app.use(express.json({ limit: "10kb" }));

app.post("/api/make-payment", async (req, res) => {
    if (!stripe) {
        return res.status(503).json({ error: "Stripe is not configured. Add STRIPE_SECRET_KEY to the backend environment." });
    }

    const items = req.body?.items;
    if (!Array.isArray(items) || items.length === 0 || items.length > CATALOG.size) {
        return res.status(400).json({ error: "Choose at least one item." });
    }

    const lineItems = [];
    const seenIds = new Set();
    for (const item of items) {
        const id = Number(item?.id);
        const quantity = Number(item?.quantity);
        const product = CATALOG.get(id);
        if (!product || seenIds.has(id) || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
            return res.status(400).json({ error: "Each cart item must use a listed product and a quantity from 1 to 10." });
        }

        seenIds.add(id);
        lineItems.push({
            price_data: {
                currency: "inr",
                product_data: { name: product.name },
                unit_amount: product.unitAmount,
            },
            quantity,
        });
    }

    try {
        const baseUrl = CLIENT_URL.replace(/\/$/, "");
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: lineItems,
            success_url: `${baseUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/?checkout=cancel`,
        });
        return res.status(201).json({ url: session.url });
    } catch {
        return res.status(502).json({ error: "Unable to start checkout. Try again shortly." });
    }
});

app.get("/api/checkout-session/:id", async (req, res) => {
    if (!stripe) {
        return res.status(503).json({ error: "Stripe is not configured." });
    }
    if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(req.params.id)) {
        return res.status(400).json({ error: "Invalid Checkout Session ID." });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.id);
        return res.json({ status: session.status, paymentStatus: session.payment_status });
    } catch {
        return res.status(404).json({ error: "Checkout Session was not found." });
    }
});

app.listen(PORT, () => {
    console.log(`Stripe demo API listening on port ${PORT}`);
});
