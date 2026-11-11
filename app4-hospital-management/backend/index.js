require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const patientsRouter = require("./src/routes/patients");
const doctorsRouter = require("./src/routes/doctors");
const appointmentsRouter = require("./src/routes/appointments");

const app = express();
const PORT = process.env.PORT || 1198;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital";

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false, limit: "50kb" }));
app.use("/patients", patientsRouter);
app.use("/doctors", doctorsRouter);
app.use("/appointments", appointmentsRouter);

async function startServer() {
    try {
        await mongoose.connect(MONGODB_URI);
        app.listen(PORT, () => console.log(`Hospital demo API listening on port ${PORT}`));
    } catch {
        console.error("Could not connect to MongoDB. Check MONGODB_URI and ensure MongoDB is running.");
        process.exitCode = 1;
    }
}

startServer();