import React, { useEffect, useState } from "react";
import axios from "axios";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1198/api/events";

export default function App() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get(API_BASE_URL)
            .then(({ data }) => setEvents(data.events || []))
            .catch((error) => toast.error(error.response?.data?.message || "Could not load events."));
    }, []);

    const handleEventAdd = (newEvent) => setEvents((current) => [...current, newEvent]);

    const handleEventDelete = (id) => {
        Swal.fire({
            title: "Delete this event?",
            showDenyButton: true,
            confirmButtonText: "Delete",
            denyButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) deleteEvent(id);
        });
    };

    const deleteEvent = async (id) => {
        try {
            const { data } = await axios.delete(`${API_BASE_URL}/${id}`);
            setEvents((current) => current.filter((event) => event._id !== id));
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not delete the event.");
        }
    };

    const handleToggleReminder = async (eventId) => {
        const selectedEvent = events.find((event) => event._id === eventId);
        if (!selectedEvent) return;
        try {
            const { data } = await axios.put(`${API_BASE_URL}/${eventId}`, { reminder: !selectedEvent.reminder });
            setEvents((current) => current.map((event) => event._id === eventId ? data.event : event));
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not update the reminder.");
        }
    };

    const onEventEdit = async (eventId, updates) => {
        try {
            const { data } = await axios.put(`${API_BASE_URL}/${eventId}`, updates);
            setEvents((current) => current.map((event) => event._id === eventId ? data.event : event));
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not update the event.");
        }
    };

    return (
        <div className="container">
            <div className="main">
                <h1>Event Management Demo</h1>
                <EventForm onEventAdd={handleEventAdd} />
                <EventList
                    events={events}
                    onEventDelete={handleEventDelete}
                    onToggleReminder={handleToggleReminder}
                    onEventEdit={onEventEdit}
                />
            </div>
            <ToastContainer />
        </div>
    );
}