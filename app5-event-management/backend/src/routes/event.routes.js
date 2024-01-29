const express = require("express");
const router = express.Router();
const Event = require("../models/event.model");

// Get all events
router.get("/", async (req, res) => {
    try {
        const events = await Event.find().sort("updatedAt");
        res.json({ success: true, message: "Fetched all events", events });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Create a new event
router.post("/", async (req, res) => {
    const event = new Event({
        title: req.body.title,
        date: req.body.date,
        reminder: req.body.reminder || false,
    });

    try {
        const newEvent = await event.save();
        res.json({ success: true, message: "Event added successfully", event: newEvent });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Delete an event
router.delete("/:id", async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        console.log("deleed");
        res.json({ success: true, message: "Event deleted" });
    } catch (error) {
        console.log(error, "error deleted");
        res.json({ success: false, message: error.message });
    }
});

// Update an event by ID
router.put("/:id", async (req, res) => {
    const eventId = req.params.id;
    const { title, date, reminder } = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.json({ success: false, message: "Event not found" });
        }

        event.date = date;
        event.title = title;
        event.reminder = reminder;
        await event.save();
        res.json({ success: true, message: "Event saved successfully", event });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

module.exports = router;

