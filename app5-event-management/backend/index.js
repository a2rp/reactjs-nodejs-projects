const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const eventRoutes = require("./src/routes/event.routes");
const app = express();
const PORT = process.env.PORT || 1198;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/eventManagement",);
const connection = mongoose.connection;
connection.once("open", () => { console.log("MongoDB database connection established successfully"); });

app.use("/api/events", eventRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

