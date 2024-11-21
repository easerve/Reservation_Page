"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Filter, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { z } from "zod";

import OptionBar from "@/containers/reservation/components/option_bar";
import Calendar from "@/containers/reservation/components/calendar";
import ReservationList from "@/containers/reservation/components/reservation_list";
import DefaultDialog from "@/components/default_dialog/default_dialog";
import OuterReservationForm, {
  outerFormSchema,
} from "@/containers/reservation/components/outer_reservation_form";
import App from "next/app";

import { Reservation } from "@/types/interface";
import { reservationData } from "@/data/data";
import { getDate2 } from "@/components/utils/date_utils";
import { getDate } from "date-fns";
import CalendarBar from "./components/calendar_bar";

export default function ReservationPage() {
  const [view, setView] = useState("list");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentMonth, setCurrentMonth] = useState<{
    year: number;
    month: number;
  }>({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });
  const handleAddEvent = (data: z.infer<typeof outerFormSchema>) => {
    const newData = {
      ...data,
      id: `Uuid-${reservations.length + 1}`,
      status: "예약 대기",
      time: new Date(data.time),
      birth: getDate2(data.birth),
      service_name: [data.service_name],
      price: 0,
    } as Reservation;
    console.log("submit done: ", newData);
    setReservations([...reservations, newData]);
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    console.log("close dialog");
    setIsDialogOpen(false);
  };

  function getNextMonth(year, month) {
    if (month === 12) {
      return `${year + 1}-01-01`;
    } else {
      return `${year}-${month + 1}-01`;
    }
  }

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `/api/reservations/range?start_date=${currentMonth.year}-${
          currentMonth.month
        }-01&end_date=${getNextMonth(currentMonth.year, currentMonth.month)}`
      );
      const data = await res.json();
      setReservations(
        data.data.map((item) => {
          return {
            ...item,
            time: new Date(item.time),
          };
        })
      );
    })();
  }, [currentMonth]);

  return (
    <div className="w-full h-full max-w-6xl mx-auto p-4 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">예약</h1>
      </div>

      <Tabs value={view} onValueChange={setView} className="w-full flex-grow">
        <div className="flex items-center gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="calendar">캘린더</TabsTrigger>
            <TabsTrigger value="list">리스트</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="default"
              className="bg-primary text-primary-foreground"
              onClick={() => {
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" color="white" />
              새로운 예약
            </Button>
          </div>
        </div>
        <TabsContent value="list" className="mt-0 flex flex-col">
          <CalendarBar
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
          />
          <div className="border-solid border-2 rounded-2xl border-gray-200 mt-4 mb-12 flex flex-col flex-grow justify-between overflow-hidden">
            <ReservationList
              reservations={reservations}
              setReservations={setReservations}
            />
            <div className="bg-primary/50 flex justify-between p-4 text-primary-foreground">
              <span className="font-bold">월 매출</span>
              <span>{reservations.length} 원</span>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="calendar" className="mt-0 flex flex-col">
          <Calendar
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            reservations={reservations}
            setReservations={setReservations}
          />
        </TabsContent>
        <DefaultDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title="예약 추가하기"
        >
          <OuterReservationForm
            onSubmit={handleAddEvent}
            onCloseDialog={handleCloseDialog}
          />
        </DefaultDialog>
      </Tabs>
    </div>
  );
}
