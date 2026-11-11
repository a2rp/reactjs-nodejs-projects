import React from "react";
import EventItem from "./EventItem";

export default function EventList({ events, onEventDelete, onToggleReminder, onEventEdit }) {
    return (
        <div>
            {events.map((event) => (
                <EventItem
                    key={event._id}
                    event={event}
                    onToggleReminder={onToggleReminder}
                    onEventDelete={onEventDelete}
                    onEventEdit={onEventEdit}
                />
            ))}
        </div>
    );
}