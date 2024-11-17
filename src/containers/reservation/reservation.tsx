"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Filter, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import OptionBar from "@/containers/reservation/components/option_bar";
import Calendar from "@/containers/reservation/components/calendar";

// Sample data
const appointments = [
  {
    id: 1,
    doctor: "김상진",
    time: "오전 10:00 - 오후 1:00",
    department: "동물이",
    location: "비싸",
    doctor_info: "가취저, 목록 S",
    status: "예약 확정",
    status_type: "confirmed",
    date: "2022-12-01",
  },
  {
    id: 2,
    doctor: "나원장",
    time: "오전 10:00 - 오후 1:00",
    department: "동물이",
    location: "비싸",
    doctor_info: "가취저, 목록 S",
    status: "예약 확정",
    status_type: "confirmed",
    date: "2022-12-02",
  },
  // Add more appointments as needed
];

export default function Reservation() {
  const [view, setView] = React.useState("list");
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    new Date(2022, 11)
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">예약</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          새로운 예약
        </Button>
      </div>

      <Tabs value={view} onValueChange={setView} className="w-full">
        <OptionBar />
        <TabsContent value="list" className="mt-0"></TabsContent>

        <TabsContent value="calendar" className="mt-0">
          <Calendar />
          {/* <Calendar
            mode="single"
            className="rounded-md border"
            captionLayout="dropdown-buttons" // 월/년 드롭다운 추가
          /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
