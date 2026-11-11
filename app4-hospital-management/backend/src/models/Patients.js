const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    age: { type: Number, required: true, min: 0, max: 150 },
    gender: { type: String, required: true, enum: ["Male", "Female", "Others"] },
}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);