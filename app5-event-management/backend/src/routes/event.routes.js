const express = require("express");
const mongoose = require("mongoose");
const Event = require("../models/event.model");
const router = express.Router();

function validDate(date) {
    return typeof date === "string" && date.length > 0 && !Number.isNaN(Date.parse(date));
}

router.get("/", async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        return res.json({ success: true, message: "Fetched all events.", events });
    } catch {
        return res.status(500).json({ success: false, message: "Unable to load events." });
    }
});

router.post("/", async (req, res) => {
    const { title, date, reminder = false } = req.body || {};
    if (typeof title !== "string" || !title.trim() || !validDate(date) || typeof reminder !== "boolean") {
        return res.status(400).json({ success: false, message: "Enter an event title, valid date, and boolean reminder value." });
    }

    try {
        const event = await Event.create({ title: title.trim(), date, reminder });
        return res.status(201).json({ success: true, message: "Event added successfully.", event });
    } catch {
        return res.status(400).json({ success: false, message: "Event details are invalid." });
    }
});

router.delete("/:id", async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid event ID." });
    }
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: "Event not found." });
        return res.json({ success: true, message: "Event deleted." });
    } catch {
        return res.status(500).json({ success: false, message: "Unable to delete event." });
    }
});

router.put("/:id", async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid event ID." });
    }
    const updates = {};
    if (Object.hasOwn(req.body || {}, "title")) {
        if (typeof req.body.title !== "string" || !req.body.title.trim()) {
            return res.status(400).json({ success: false, message: "Event title is required." });
        }
        updates.title = req.body.title.trim();
    }
    if (Object.hasOwn(req.body || {}, "date")) {
        if (!validDate(req.body.date)) {
            return res.status(400).json({ success: false, message: "Enter a valid event date." });
        }
        updates.date = req.body.date;
    }
    if (Object.hasOwn(req.body || {}, "reminder")) {
        if (typeof req.body.reminder !== "boolean") {
            return res.status(400).json({ success: false, message: "Reminder must be true or false." });
        }
        updates.reminder = req.body.reminder;
    }
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ success: false, message: "No event fields were provided." });
    }

    try {
        const event = await Event.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!event) return res.status(404).json({ success: false, message: "Event not found." });
        return res.json({ success: true, message: "Event updated successfully.", event });
    } catch {
        return res.status(400).json({ success: false, message: "Event details are invalid." });
    }
});

module.exports = router;