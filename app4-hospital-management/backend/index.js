const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const patientsRouter = require("./src/routes/patients");
const doctorsRouter = require("./src/routes/doctors");
const appoinmentsRouter = require("./src/routes/appointments")
const app = express();
const PORT = process.env.PORT || 1198;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/hospital",);
const connection = mongoose.connection;
connection.once("open", () => { console.log("MongoDB database connection established successfully"); });

app.use("/patients", patientsRouter);
app.use("/doctors", doctorsRouter);
app.use("/appointments", appoinmentsRouter)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

