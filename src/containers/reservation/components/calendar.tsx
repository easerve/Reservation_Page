"use client";

import React, { useState, useEffect } from "react";
import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Copy } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import "@/styles/calendar/style.css";
import ReservationForm, { formSchema } from "./reservation_form";
import { z } from "zod";

const Calendar: React.FC = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);

  useEffect(() => {
    // Load events from local storage when the component mounts
    if (typeof window !== "undefined") {
      const savedEvents = localStorage.getItem("events");
      if (savedEvents) {
        setCurrentEvents(JSON.parse(savedEvents));
      }
    }
  }, []);

  useEffect(() => {
    // Save events to local storage whenever they change
    if (typeof window !== "undefined") {
      localStorage.setItem("events", JSON.stringify(currentEvents));
    }
  }, [currentEvents]);

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };

  const handleEventClick = (selected: EventClickArg) => {
    // Prompt user for confirmation before deleting an event
    if (
      window.confirm(
        `Are you sure you want to delete the event "${selected.event.title}"?`
      )
    ) {
      selected.event.remove();
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle("");
  };

  const handleAddEvent = (data: z.infer<typeof formSchema>) => {
    // e.preventDefault();
    console.log(data, newEventTitle, selectedDate);
    if (selectedDate) {
      const calendarApi = selectedDate.view.calendar; // Get the calendar API instance.
      calendarApi.unselect(); // Unselect the date range.

      console.log(data.reservationTime.toISOString());
      const newEvent = {
        id: `${data.reservationTime.toISOString()}-${newEventTitle}`,
        title: data.breed,
        start: data.reservationTime.toISOString(),
        end: data.reservationTime.toISOString(),
      };

      console.log(newEvent);
      calendarApi.addEvent(newEvent);
      handleCloseDialog();
    }
  };

  return (
    <div>
      <div className="full-calendar flex w-full px-10 py-10 justify-start items-start gap-8">
        <FullCalendar
          height={"auto"}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // Initialize calendar with required plugins.
          headerToolbar={{
            left: "prev",
            center: "title",
            right: "next",
          }} // Set header toolbar options.
          initialView="dayGridMonth" // Initial view mode of the calendar.
          editable={true} // Allow events to be edited.
          selectable={true} // Allow dates to be selectable.
          selectMirror={true} // Mirror selections visually.
          dayMaxEvents={true} // Limit the number of events displayed per day.
          select={handleDateClick} // Handle date selection to create new events.
          eventClick={handleEventClick} // Handle clicking on events (e.g., to delete them).
          eventsSet={(events) => setCurrentEvents(events)} // Update state with current events whenever they change.
          initialEvents={
            typeof window !== "undefined"
              ? JSON.parse(localStorage.getItem("events") || "[]")
              : []
          } // Initial events loaded from local storage.
        />
      </div>

      {/* Dialog for adding new events */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* <DialogTrigger asChild>
          <Button variant="outline">Share</Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>예약 추가하기</DialogTitle>
            <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>
          <ReservationForm onSubmit={handleAddEvent} />
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event Details</DialogTitle>
          </DialogHeader>
          <form className="space-x-5 mb-4" onSubmit={handleAddEvent}>
            <input
              type="text"
              placeholder="Event Title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)} // Update new event title as the user types.
              required
              className="border border-gray-200 p-3 rounded-md text-lg"
            />
            <button
              className="bg-green-500 text-white p-3 mt-5 rounded-md"
              type="submit"
            >
              Add
            </button>{" "}
          </form>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default Calendar; // Export the Calendar component for use in other parts of the application.
