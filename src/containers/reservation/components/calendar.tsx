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
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
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

interface CalendarProps {
  currentMonth: { year: number; month: number };
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  setCurrentMonth: React.Dispatch<
    React.SetStateAction<{ year: number; month: number }>
  >;
  updateReservation: (id: string, updatedData: Partial<Reservation>) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  reservations,
  setReservations,
  setCurrentMonth,
  updateReservation,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<DateClickArg | null>(null);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [monthEvents, setMonthEvents] = useState<EventInput[]>([]);

  function handleDateSet(info: DatesSetArg) {
    const year = info.view.currentStart.getFullYear();
    const month = info.view.currentStart.getMonth() + 1;

    setCurrentMonth({ year: year, month: month });

    const filteredReservations = reservations.filter((data) => {
      return (
        data.time.getFullYear() === year && data.time.getMonth() + 1 === month
      );
    });

    const events: EventInput[] = filteredReservations.map(
      (data: Reservation) => ({
        id: data.id,
        title: `${data.name}(${data.breed})`,
        start: data.time,
        extendedProps: data,
      })
    );

    setMonthEvents(events);
  }

  // useEffect to update monthEvents when reservations change
  useEffect(() => {
    if (reservations.length > 0) {
      const events: EventInput[] = reservations
        .filter((data) => {
          return (
            data.time.getFullYear() === currentMonth.year &&
            data.time.getMonth() + 1 === currentMonth.month
          );
        })
        .map((data: Reservation) => ({
          id: data.id,
          title: `${data.name}(${data.breed})`,
          start: data.time,
          extendedProps: data,
        }));
      setMonthEvents(events);
    }
  }, [reservations, currentMonth]);

  const handleDateClick = (selected: DateClickArg) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };

  const handleEventClick = (selected: EventClickArg) => {
    setSelectedReservation(selected.event.extendedProps as Reservation);
    setIsInfoDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
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
    handleSave(selectedReservation.id, data);
  }

  const handleAddEvent = (data: z.infer<typeof innerFormSchema>) => {
    // e.preventDefault();
    if (selectedDate) {
      const calendarApi = selectedDate.view.calendar; // Get the calendar API instance.
      calendarApi.unselect(); // Unselect the date range.

      const startTime = updateTimeInDate(
        selectedDate.date,
        data.reservationTime
      );
      const newEvent = {
        id: `${startTime.toISOString()}-${data.phoneNumber}`,
        title: `${data.petName}(${data.breed})`,
        phoneNumber: data.phoneNumber,
        start: startTime.toISOString(),
        end: startTime.toISOString(),
      };

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
          datesSet={handleDateSet}
          editable={true} // Allow events to be edited.
          selectable={true} // Allow dates to be selectable.
          selectMirror={true} // Mirror selections visually.
          dayMaxEvents={true} // Limit the number of events displayed per day.
          dateClick={handleDateClick} 
          eventClick={handleEventClick} // Handle clicking on events (e.g., to delete them).
          events={monthEvents} // Events to display on the calendar.
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
            updateReservation={updateReservation}
            onCloseDialog={() => setIsEditDialogOpen(false)}
          />
        )}
      </DefaultDialog>
    </div>
  );
};

export default Calendar; // Export the Calendar component for use in other parts of the application.
