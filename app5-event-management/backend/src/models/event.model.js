const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    reminder: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });
const Event = mongoose.model("Event", eventSchema);

module.exports = Event;

