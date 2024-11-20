"use client";

import React, { useState, useEffect } from "react";
import {
  formatDate,
  DatesSetArg,
  DateSelectArg,
  EventClickArg,
  EventApi,
  EventInput,
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
import InnerReservationForm, {
  innerFormSchema,
} from "./inner_reservation_form";
import { z } from "zod";
import DefaultDialog from "@/components/default_dialog/default_dialog";
import { Reservation } from "@/types/interface";
import { reservationData } from "@/data/data";
import InfoDialog from "@/containers/reservation/components/info_dialog";
import EditReservationForm, { editFormSchema } from "./edit_reservation_form";

function updateTimeInDate(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);

  const updatedDate = new Date(date);

  updatedDate.setHours(hours);
  updatedDate.setMinutes(minutes);
  updatedDate.setSeconds(0); // 초는 0으로 설정 (선택사항)

  return updatedDate;
}

const Calendar: React.FC = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const [reservations, setReservations] = useState<EventInput[]>([]);

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
    console.log(selected.event.extendedProps);
    setSelectedReservation(selected.event.extendedProps as Reservation);
    setIsInfoDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle("");
  };

  const handleSave = (id: string, updatedData: Partial<Reservation>) => {
    if (selectedReservation) {
      setReservations(
        reservations.map((reservation) =>
          reservation.id === selectedReservation.id
            ? { ...reservation, ...updatedData }
            : reservation
        )
      );
      setIsEditDialogOpen(false);
      setSelectedReservation(null);
    }
  };

  function handleSubmit(data: z.infer<typeof editFormSchema>) {
    console.log("submit done: ", data);
    handleSave(selectedReservation.id, data);
  }

  const handleAddEvent = (data: z.infer<typeof innerFormSchema>) => {
    // e.preventDefault();
    console.log(data, newEventTitle, selectedDate); // debug
    if (selectedDate) {
      const calendarApi = selectedDate.view.calendar; // Get the calendar API instance.
      calendarApi.unselect(); // Unselect the date range.

      const startTime = updateTimeInDate(
        selectedDate.start,
        data.reservationTime
      );
      const newEvent = {
        id: `${startTime.toISOString()}-${data.phoneNumber}`,
        title: `${data.petName}(${data.breed})`,
        phoneNumber: data.phoneNumber,
        start: startTime.toISOString(),
        end: startTime.toISOString(),
      };

      console.log(newEvent);
      calendarApi.addEvent(newEvent);
      handleCloseDialog();
    }
  };

  function handleDateSet(info: DatesSetArg) {
    const currentYear = info.view.currentStart.getFullYear(); // 현재 뷰의 시작 연도
    const currentMonth = info.view.currentStart.getMonth() + 1; // 현재 뷰의 시작 월 (0부터 시작하므로 +1)

    console.log(`Year: ${currentYear}, Month: ${currentMonth}`);
    const currentMonthReservations = reservationData.filter((data) => {
      return (
        data.time.getFullYear() === currentYear &&
        data.time.getMonth() + 1 === currentMonth
      );
    });
    const monthReservations: EventInput[] = currentMonthReservations.map(
      (data: Reservation) => ({
        id: data.id,
        title: `${data.name}(${data.breed})`,
        start: data.time,
        extendedProps: data,
      })
    );
    setReservations(monthReservations);
  }

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
          datesSet={handleDateSet}
          editable={true} // Allow events to be edited.
          selectable={true} // Allow dates to be selectable.
          selectMirror={true} // Mirror selections visually.
          dayMaxEvents={true} // Limit the number of events displayed per day.
          select={handleDateClick} // Handle date selection to create new events.
          eventClick={handleEventClick} // Handle clicking on events (e.g., to delete them).
          eventsSet={(events) => setCurrentEvents(events)} // Update state with current events whenever they change.
          events={reservations} // Events to display on the calendar.
          initialEvents={
            typeof window !== "undefined"
              ? JSON.parse(localStorage.getItem("events") || "[]")
              : []
          } // Initial events loaded from local storage.
        />
      </div>

      {/* Dialog for adding new events */}
      <DefaultDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="예약 추가하기"
      >
        <InnerReservationForm
          onSubmit={handleAddEvent}
          onCloseDialog={handleCloseDialog}
        />
      </DefaultDialog>
      <InfoDialog
        reservation={selectedReservation}
        open={isInfoDialogOpen}
        onOpenChange={setIsInfoDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
      />
      <DefaultDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="예약 수정하기"
      >
        {selectedReservation && (
          <EditReservationForm
            reservation={selectedReservation}
            onSubmit={handleSubmit}
            onCloseDialog={() => setIsEditDialogOpen(false)}
          />
        )}
      </DefaultDialog>
    </div>
  );
};

export default Calendar; // Export the Calendar component for use in other parts of the application.
