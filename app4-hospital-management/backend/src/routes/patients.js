const express = require("express");
const router = express.Router();
const Patient = require("../models/Patients");

// Get all patients
router.get("/", (req, res) => {
    try {
        Patient.find().sort({ updatedAt: -1 }).then(patients => res.json(patients)).catch(err => res.status(400).json("Error: " + err));
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Add new patient
router.post("/add", (req, res) => {
    try {
        const { name, age, gender } = req.body;
        const newPatient = new Patient({ name, age, gender });
        newPatient.save().then(savedPatient => res.json(savedPatient)).catch(err => res.status(400).json("Error: " + err));
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Update patient data
router.post("/update/:id", (req, res) => {
    try {
        Patient.findById(req.params.id).then(patient => {
            if (!patient) {
                return res.status(404).json("Patient not found");
            }

            patient.name = req.body.name;
            patient.age = req.body.age;
            patient.gender = req.body.gender;
            patient.save().then(() => res.json("Patient updated!")).catch(err => res.status(400).json("Error: " + err));
        }).catch(err => res.status(400).json("Error: " + err));
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Delete patient by ID
router.delete("/delete/:id", (req, res) => {
    try {
        Patient.findByIdAndDelete(req.params.id).then(patient => {
            if (!patient) {
                return res.status(404).json("Patient not found");
            }
            res.json("Patient deleted!");
        }).catch(err => res.status(400).json("Error: " + err));
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

module.exports = router;
