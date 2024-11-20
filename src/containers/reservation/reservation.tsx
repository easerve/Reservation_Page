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
import ReservationList from "./components/reservation_list";


export default function Reservation() {
  const [view, setView] = React.useState("list");
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    new Date(2022, 11)
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">예약</h1>
      </div>

      <Tabs value={view} onValueChange={setView} className="w-full">
        <OptionBar />
        <TabsContent value="list" className="mt-0">
          <ReservationList />
        </TabsContent>

        {/* <TabsContent value="calendar" className="mt-0">
          <Calendar />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
