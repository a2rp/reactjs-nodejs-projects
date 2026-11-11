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
            if (!appointment) {
                return res.status(404).json("Appointment not found");
            }

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
        if (!response) {
            return res.status(404).json({ success: false, message: "Appointment not found." });
        }
        res.json({ success: true, message: "Appointment deleted." });
    } catch (error) {
        res.status(400).json({ success: false, message: "Unable to delete appointment." });
    }
});

module.exports = router;

