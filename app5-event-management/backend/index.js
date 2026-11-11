require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const eventRoutes = require("./src/routes/event.routes");

const app = express();
const PORT = process.env.PORT || 1198;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/eventManagement";

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false, limit: "50kb" }));
app.use("/api/events", eventRoutes);

async function startServer() {
    try {
        await mongoose.connect(MONGODB_URI);
        app.listen(PORT, () => console.log(`Event demo API listening on port ${PORT}`));
    } catch {
        console.error("Could not connect to MongoDB. Check MONGODB_URI and ensure MongoDB is running.");
        process.exitCode = 1;
    }
}

startServer();