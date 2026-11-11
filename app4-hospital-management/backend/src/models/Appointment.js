const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    patientName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    doctorName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    date: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);