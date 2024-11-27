import React, { useMemo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingData, BookedDate } from "@/types/booking";
import { ALL_TIME_SLOTS } from "@/constants/booking";

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
  const [isLoading, setIsLoading] = useState(true);
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
  const [additionalBookedDates, setAdditionalBookedDates] = useState<
    BookedDate[]
  >([]);

  async function fetchReservationDates() {
    try {
      setIsLoading(true);
      // const res = await fetch("/api/reservations?scope=2");
      // const data = await res.json();
      // console.log(data);
      const data = {
        data: {
          booked_data: [
            { date: "2024-11-29", times: ["10:00", "14:00"] },
            { date: "2024-11-30", times: ["10:00", "17:00"] },
            { date: "2024-12-01", times: ["10:00", "14:00", "17:00"] },
          ],
          additional_booked_data: [
            { date: "2024-12-30", times: ["13:00", "19:00"] },
            { date: "2024-01-21", times: ["15:00"] },
          ],
        },
        status: "success",
      };

      if (data.status !== "success") {
        throw new Error("Failed to fetch booked dates");
      }

      setBookedDates(data.data.booked_data);
      setAdditionalBookedDates(data.data.additional_booked_data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchReservationDates();
  }, []);

  const updateDate = (date: Date) => {
    if (!date) return;
    // 한국 시간대로 변경 (UTC 보정) https://apost.dev/javascript-dategaegce-siganeul-hangug-siganeuro-seoljeonghagi/
    const offset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() - offset);
    setBookingData((prev) => ({
      ...prev,
      dateTime: {
        date: adjustedDate,
        time: undefined, // 새로운 날짜를 선택하면 시간은 초기화
      },
    }));
  };

  const updateTime = (time: string) => {
    setBookingData((prev) => ({
      ...prev,
      dateTime: { ...prev.dateTime, time },
    }));
  };

  const getAvailableTimeSlotsForDate = (date: Date | undefined): string[] => {
    if (!date) return [];

    const allSlots = [...ALL_TIME_SLOTS];

    const additionalBooking = additionalBookedDates.find(
      (booking) =>
        new Date(booking.date).toDateString() === date.toDateString(),
    );

    if (additionalBooking) {
      allSlots.push(...additionalBooking.times);
    }

    // 중복 제거 및 시간 순으로 정렬
    const uniqueTimeSlots = Array.from(new Set(allSlots));
    // sort() 함수는 양수를 반환할 때 (a, b) 순서를 (b, a)로 바꿈
    uniqueTimeSlots.sort((a, b) => {
      const [aHour, aMin] = a.split(":").map(Number);
      const [bHour, bMin] = b.split(":").map(Number);
      return aHour * 60 + aMin - (bHour * 60 + bMin);
    });

    return uniqueTimeSlots;
  };

  const getBookedTimesForDate = (date: Date | undefined): string[] => {
    if (!date) return [];

    const bookingsForDate = bookedDates.filter(
      (booking) =>
        new Date(booking.date).toDateString() === date.toDateString(),
    );

    const additionalBookingsForDate = additionalBookedDates.filter(
      (booking) =>
        new Date(booking.date).toDateString() === date.toDateString(),
    );

    const times = [
      ...bookingsForDate.flatMap((booking) => booking.times),
      ...additionalBookingsForDate.flatMap((booking) => booking.times),
    ];

    return times;
  };

  const fullyBookedDates = useMemo(() => {
    // bookedDates와 additionalBookedDates를 합침
    const allBookingsMap: { [date: string]: Set<string> } = {};

    [...bookedDates, ...additionalBookedDates].forEach((booking) => {
      const dateStr = booking.date;
      if (!allBookingsMap[dateStr]) {
        allBookingsMap[dateStr] = new Set();
      }
      booking.times.forEach((time) => allBookingsMap[dateStr].add(time));
    });

    // 모든 시간대가 예약된 날짜 찾기
    const fullyBooked = Object.entries(allBookingsMap)
      .filter(([, timesSet]) => {
        const uniqueTimes = Array.from(timesSet);
        // 예약된 시간대 수가 가능한 모든 시간대 수보다 크거나 같은 경우
        return uniqueTimes.length >= ALL_TIME_SLOTS.length;
      })
      .map(([date]) => new Date(date));

    return fullyBooked;
  }, [bookedDates, additionalBookedDates]);

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
            className="flex justify-center"
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const fiveMonthsFromNow = new Date(
                new Date().setMonth(new Date().getMonth() + 6),
              );
              const isWeekend = date.getDay() === 0 || date.getDay() === 6; // 일요일=0, 토요일=6
              const shouldDisableWeekdays =
                bookingData.dog.breedType === 4 || bookingData.dog.weight >= 15;

              return (
                date < today ||
                date > fiveMonthsFromNow ||
                fullyBookedDates.some(
                  (bookedDate) =>
                    bookedDate.toDateString() === date.toDateString(),
                ) ||
                (shouldDisableWeekdays && !isWeekend) // 조건에 따라 평일 비활성화
              );
            }}
          />
          {isLoading ? (
            <div className="flex justify-center mt-4">
              <div className="loader animate-spin rounded-full border-4 border-t-transparent border-gray-500 w-8 h-8"></div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {getAvailableTimeSlotsForDate(bookingData.dateTime.date).map(
                (time) => {
                  const now = new Date();
                  const selectedDateTime = new Date(bookingData.dateTime.date);

                  const [hours, minutes] = time.split(":").map(Number);
                  selectedDateTime.setHours(hours, minutes, 0, 0);

                  const isDisabled =
                    selectedDateTime < now ||
                    getBookedTimesForDate(bookingData.dateTime.date).includes(
                      time,
                    );

                  return (
                    <Button
                      key={time}
                      variant={
                        bookingData.dateTime.time === time
                          ? "default"
                          : "outline"
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
                },
              )}
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
