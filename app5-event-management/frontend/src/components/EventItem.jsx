import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, TextField } from "@mui/material";

export default function EventItem({ event, onEventDelete, onToggleReminder, onEventEdit }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(event.title);
    const [editedDate, setEditedDate] = useState(moment(event.date).format("YYYY-MM-DD"));

    useEffect(() => {
        setEditedTitle(event.title);
        setEditedDate(moment(event.date).format("YYYY-MM-DD"));
    }, [event._id, event.title, event.date]);

    const handleCancelClick = () => {
        setEditedTitle(event.title);
        setEditedDate(moment(event.date).format("YYYY-MM-DD"));
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        const title = editedTitle.trim();
        if (!title || !editedDate) return;
        onEventEdit(event._id, { title, date: editedDate });
        setIsEditing(false);
    };

    return (
        <article style={{ backgroundColor: "aliceblue", padding: "12px 16px", marginTop: 15, position: "relative" }}>
            {isEditing ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    <TextField size="small" type="text" label="Title" fullWidth value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
                    <TextField size="small" type="date" label="Date" fullWidth inputProps={{ min: new Date().toISOString().split("T")[0] }} value={editedDate} onChange={(e) => setEditedDate(e.target.value)} />
                    <Button onClick={handleSaveClick} size="small" variant="contained">Save</Button>
                    <Button onClick={handleCancelClick} size="small" variant="outlined">Cancel</Button>
                </div>
            ) : (
                <>
                    <h3 style={{ fontWeight: "bold" }}>{event.title}</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
                        <div>Event date: {moment(event.date).calendar()}</div>
                        <strong>{event.reminder ? "Reminder on" : "Reminder off"}</strong>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 15 }}>
                        <Button variant="contained" size="small" onClick={() => setIsEditing(true)}>Edit</Button>
                        <Button variant="outlined" color="error" size="small" onClick={() => onEventDelete(event._id)}>Delete</Button>
                        <Button variant="outlined" size="small" onClick={() => onToggleReminder(event._id)}>
                            {event.reminder ? "Disable reminder" : "Enable reminder"}
                        </Button>
                    </div>
                </>
            )}
        </article>
    );
}