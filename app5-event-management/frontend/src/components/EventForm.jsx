import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, TextField } from "@mui/material";

const EventForm = ({ onEventAdd }) => {
    const [newEvent, setNewEvent] = useState({ title: "", date: "", reminder: false });

    const handleInputChange = (event) => {
        setNewEvent({ ...newEvent, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("/", newEvent);
            onEventAdd(response.data.event);
            setNewEvent({ title: "", date: "", reminder: false });
            toast(response.data.message);
        } catch (error) {
            toast(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "15px", padding: "15px", backgroundColor: "aliceblue" }}>
            <TextField label="Title" size="small" name="title" fullWidth
                value={newEvent.title}
                onChange={handleInputChange} required />

            <TextField size="small" type="date" name="date" fullWidth
                inputProps={{ min: new Date().toISOString().split("T")[0], }}
                value={newEvent.date}
                onChange={handleInputChange} required />

            <Button size="small" type="submit" variant="contained" fullWidth>Add Event</Button>
        </form>
    );
};

export default EventForm;
