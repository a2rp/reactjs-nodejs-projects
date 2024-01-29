import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";

const EventItem = ({ event, onEventDelete, onToggleReminder, onEventEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(event.title);
    const [editedDate, setEditedDate] = useState(moment(event.date).format("YYYY-MM-DD"));
    const [rem, setRem] = useState("")

    useEffect(() => {
        if (event) {
            setRem(event.reminder ? "" : "Reminder On");

            const today = new Date();
            const eventDate = new Date(event.date);

            today.setHours(0, 0, 0, 0);
            eventDate.setHours(0, 0, 0, 0);

            if (today.getTime() === eventDate.getTime() && event.reminder) {
                toast(`Today is the day of the event: ${event.title}`);
                // alert(`Today is the day of the event: ${event.title}`);
            }
        } else {
            setRem("Reminder On");
        }
    }, [event, event.reminder]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        onEventEdit(event._id, { title: editedTitle, date: editedDate });
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setEditedTitle(event.title);
        setEditedDate(moment(event.date).format("YYYY-MM-DD"));
        setIsEditing(false);
    };

    return (
        <div style={{ backgroundColor: "aliceblue", padding: "5px 15px 5px 15px", margin: "15px 0 0 0", position: "relative" }}>
            <div>
                {isEditing
                    ? (
                        <div style={{ display: "flex", gap: "30px" }}>
                            <TextField size="small" type="text" label="Title" fullWidth
                                value={editedTitle}
                                onChange={(event) => setEditedTitle(event.target.value)}
                            />
                            <TextField type="date" size="small" label="Date" fullWidth
                                inputProps={{ min: new Date().toISOString().split("T")[0], }}
                                value={editedDate}
                                onChange={(event) => setEditedDate(event.target.value)}
                            />
                            <Button onClick={handleSaveClick} size="small" variant="contained" fullWidth>Save</Button>
                            <Button onClick={handleCancelClick} size="small" variant="contained" fullWidth>Cancel</Button>
                        </div>
                    ) : (
                        <div style={{}}>
                            <h3 style={{ fontWeight: "bold" }}>{event.title}</h3>
                            <div style={{ display: "flex", gap: "30px", justifyConten: "space-between", alignItems: "center" }}>
                                <div style={{ width: "100%" }}><span>Event date: </span>[{moment(event.date).add(0, "days").calendar()}]</div>
                                <div style={{ fontWeight: "bold" }}>
                                    {event.reminder
                                        ? <div style={{ color: "#00f" }}>Reminder_On</div>
                                        : <div style={{ color: "#f00" }}>Reminder_Off</div>}
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "15px", alignItems: "center", marginTop: "15px" }}>
                                <Button variant="contained" size="small" onClick={handleEditClick} fullWidth>Edit</Button>
                                <Button variant="contained" size="small" onClick={() => onEventDelete(event._id)} fullWidth>Delete</Button>
                                <Button variant="contained" size="small" onClick={() => onToggleReminder(event._id)} fullWidth>{event.reminder ? "Disable Reminder" : "Enable Reminder"}</Button>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default EventItem;
