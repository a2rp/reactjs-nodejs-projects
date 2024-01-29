const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// Get all appointments
router.get("/", (req, res) => {
    try {
        Appointment.find().then(appointments => res.json(appointments)).catch(err => res.status(400).json("Error: " + err));
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Add new appointment
router.post("/add", (req, res) => {
    try {
        const { patientName, doctorName, date } = req.body;
        const newAppointment = new Appointment({ patientName, doctorName, date });
        newAppointment.save().then(savedAppointment => res.json(savedAppointment)).catch(err => res.status(400).json("Error: " + err));
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Update appointment data
router.post("/update/:id", (req, res) => {
    try {
        Appointment.findById(req.params.id).then(appointment => {
            appointment.patientName = req.body.patientName;
            appointment.doctorName = req.body.doctorName;
            appointment.date = req.body.date;

            appointment.save().then(() => res.json("Appointment updated!")).catch(err => res.status(400).json("Error: " + err));
        }).catch(err => res.status(400).json("Error: " + err));
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Delete appointment
router.delete("/delete/:id", async (req, res) => {
    try {
        console.log(req.params.id, "req.params.id");
        const response = await Appointment.findByIdAndDelete(req.params.id);
        console.log(response, "delete response");
        res.json({ success: true, message: "Appointment deleted." });
    } catch (error) {
        console.log(error, "Error deleting appointment");
        res.json({ success: false, message: error.message });
    }
});

module.exports = router;

