import React, { useState, useEffect } from "react";
import axios from "axios";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import "./App.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const App = () => {
    axios.defaults.baseURL = "http://localhost:1198/api/events";
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const getAllEvents = async () => {
            try {
                const response = await axios.get("/");
                const data = response.data;
                console.log(data, "all events");
                setEvents(data.events);
                // toast(data.message);
            } catch (error) {
                toast(error.message);
            }
        };
        getAllEvents();
    }, []);

    const handleEventAdd = (newEvent) => {
        setEvents([...events, newEvent]);
    };

    const handleEventDelete = async (id) => {
        Swal.fire({
            title: "Do you want to delete?",
            showDenyButton: true,
            confirmButtonText: "Delete",
            denyButtonText: `Cancel`
        }).then((result) => {
            if (result.isConfirmed) {
                deleteEvent(id);
            } else if (result.isDenied) {
            }
        });
    }

    const deleteEvent = async (id) => {
        try {
            const response = await axios.delete(`/${id}`);
            console.log(response, "event deleted");
            if (response.data.success === true) {
                setEvents(events.filter(event => event._id !== id));
            }
            toast(response.data.message);
        } catch (error) {
            toast(error.message);
        }
    };

    const handleToggleReminder = (eventId) => {
        const selectedEvent = events.find(event => event._id === eventId);
        const updatedEvent = { ...selectedEvent, reminder: !selectedEvent.reminder };

        const updateReminder = async () => {
            try {
                const response = await axios.put(`/${eventId}`, updatedEvent);
                const updatedEvents = events.map(event =>
                    event._id === eventId ? updatedEvent : event
                );
                setEvents(updatedEvents);
                toast(response.data.message);
            } catch (error) {
                toast(error.message);
            }
        };
        updateReminder();
    };

    const onEventEdit = async (eventId, updatedData) => {
        try {
            const response = await axios.put(`/${eventId}`, updatedData);
            const updatedEvents = events.map(event => event._id === eventId ? { ...event, ...updatedData } : event);
            setEvents(updatedEvents);
            toast(response.data.message);
        } catch (error) {
            toast(error.message);
        }
    }

    return (
        <div className="container">
            <div className="main">
                <h1>a2rp: Event Management App</h1>
                <EventForm onEventAdd={handleEventAdd} />
                <EventList
                    events={events || []}
                    onEventDelete={handleEventDelete}
                    onToggleReminder={handleToggleReminder}
                    onEventEdit={onEventEdit}
                />

            </div>

            <ToastContainer />
        </div>
    );
};

export default App;
