const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    speciality: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);