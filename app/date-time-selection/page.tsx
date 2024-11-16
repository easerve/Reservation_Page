
'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useBooking } from '../context/bookingContext';

export default function Component() {
  const { bookingData, updateDateTime } = useBooking();
  const [date, setDate] = useState<Date | undefined>(bookingData.dateTime.date);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    bookingData.dateTime.time
  );

  const handleDateTimeSelection = () => {
    updateDateTime(date, selectedTime);
  };

  const timeSlots = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
  ];

  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">날짜 및 시간 선택</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">희망 날짜 선택</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">희망 시간 선택</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? 'default' : 'outline'}
                className={
                  selectedTime === time ? 'bg-green-500 hover:bg-green-600' : ''
                }
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button
        className="w-full mt-6 bg-green-500 hover:bg-green-600"
        disabled={!date || !selectedTime}
        onClick={handleDateTimeSelection}
        asChild
      >
        <Link href="/pet-info">다음</Link>
      </Button>
    </div>
  );
}
