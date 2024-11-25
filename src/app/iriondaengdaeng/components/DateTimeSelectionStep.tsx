import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ALL_TIME_SLOTS } from "@/constants/booking";
import { BookingData } from "@/types/booking";
import React, { useMemo, useEffect, useState } from "react";

interface DateTimeSelectionStepProps {
  bookingData: BookingData;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
}

export default function DateTimeSelectionStep({
  bookingData,
  setCurrentStep,
  setBookingData,
}: DateTimeSelectionStepProps) {
  const [bookedDates, setBookedDates] = useState<
    {
      date: string;
      times: string[];
    }[]
  >([]);
  async function fetchBookedDate() {
    try {
      const res = await fetch("/api/reservations?scope=6");
      const data = await res.json();
      setBookedDates(data.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchBookedDate();
  }, []);

  const getBookedTimesForDate = (date: Date | undefined): string[] => {
    if (!bookedDates.length || !date) return [];
    const booking = bookedDates.find(
      (booking) => new Date(booking.date).toDateString() === date.toDateString()
    );
    return booking ? booking.times : [];
  };

  const fullyBookedDates = useMemo(() => {
    if (bookedDates.length === 0) return [];
    return bookedDates
      .filter(
        (booking) => (booking.times ?? []).length >= ALL_TIME_SLOTS.length
      )
      .map((booking) => new Date(booking.date));
  }, [bookedDates]);

  const updateDate = (date: Date) => {
    if (!date) return;
    // NOTE: 한국 시간으로 변경
    const offset = date.getTimezoneOffset() * 60000;
    date = new Date(date.getTime() - offset);
    setBookingData((prev) => ({
      ...prev,
      dateTime: {
        date,
        time: undefined,
      },
    }));
  };

  const updateTime = (time: string) => {
    setBookingData((prev) => ({
      ...prev,
      dateTime: { ...prev.dateTime, time },
    }));
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>날짜 및 시간 선택</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={bookingData.dateTime.date}
            onSelect={(date) => {
              updateDate(date);
            }}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const fiveMonthsFromNow = new Date(
                new Date().setMonth(new Date().getMonth() + 6)
              );
              return (
                date < today ||
                date > fiveMonthsFromNow ||
                fullyBookedDates.some(
                  (bookedDate) =>
                    bookedDate.toDateString() === date.toDateString()
                )
              );
            }}
          />
          {bookingData.dateTime.date && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {ALL_TIME_SLOTS.map((time) => {
                const now = new Date();
                const selectedDateTime = new Date(bookingData.dateTime.date);

                const [hours, minutes] = time.split(":").map(Number);
                selectedDateTime.setHours(hours, minutes, 0, 0);

                const isDisabled =
                  selectedDateTime < now ||
                  getBookedTimesForDate(bookingData.dateTime.date).includes(
                    time
                  );

                return (
                  <Button
                    key={time}
                    variant={
                      bookingData.dateTime.time === time ? "default" : "outline"
                    }
                    className={
                      bookingData.dateTime.time === time ? "bg-primary" : ""
                    }
                    disabled={isDisabled}
                    onClick={() => updateTime(time)}
                  >
                    {time}
                  </Button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(2)}
        >
          이전
        </Button>
        <Button
          className="flex-1 bg-primary"
          onClick={() => setCurrentStep(4)}
          disabled={!bookingData.dateTime.time}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
