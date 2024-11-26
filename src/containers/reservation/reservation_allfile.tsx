"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
  X,
} from "lucide-react";
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
import { getDate2 } from "@/components/utils/date_utils";
import { getDate, set } from "date-fns";
import CalendarBar from "./components/calendar_bar";
import {
  getReservationsByPhoneNumber,
  getReservationsOfOneMonth,
} from "@/services/admin/get";
import { ReservationUpdate } from "@/actions/reservations";
import { PetInfo } from "@/actions/pets";

export default function ReservationPage() {
  const [view, setView] = useState("list");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentMonth, setCurrentMonth] = useState<{
    year: number;
    month: number;
  }>({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });
  const [breeds, setBreeds] = useState<
    { id: number; name: string; type: number }[]
  >([]);

  const [phoneNumber, setPhoneNumber] = useState<string>("");

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/pets/breed`);
      const data = await res.json();
      setBreeds(data.data);
    })();
  }, []);
  const monthlyRevenue = useRef<string>("0");

  const handleAddEvent = (data: z.infer<typeof outerFormSchema>) => {
    const petData = {
      petName: data.name,
      weight: data.weight,
      birth: "", // null
      phoneNumber: data.phone,
      breed: 0, // idontknow
      neutering: false, // null
      sex: null,
      regNumber: null,
      bite: null,
      heart_disease: null,
      underlying_disease: null,
    } as PetInfo;

    // if 이미 등록된 강아지라서 pet_id가 있을 때
    const reservationData = {
      // pet_id: data.pet_id,
      reservation_date: data.time,
      memo: data.memo,
      status: "예약확정",
      service_name: data.service_name,
      additional_services: data.additional_services,
      total_price: 0,
      additional_price: data.additional_price,
    };
    // setReservations([...reservations, newData]);
    // handleCloseDialog();
  };

  const handleCloseDialog = () => {
    // console.log("close dialog");
    return;
    setIsDialogOpen(false);
  };

  useEffect(() => {
    (async () => {
      if (phoneNumber === "") {
        const reservations = await getReservationsOfOneMonth(
          currentMonth.year,
          currentMonth.month,
        );
        setReservations(reservations);
      }
    })();
  }, [currentMonth, phoneNumber]);

  function updateReservation(id: string, data: Partial<Reservation>) {
    const newReservations = reservations.map((reservation) => {
      return reservation.id === id ? { ...reservation, ...data } : reservation;
    });
    setReservations(newReservations);
  }

  function deleteReservation(id: string) {
    const newReservations = reservations.filter(
      (reservation) => reservation.id !== id,
    );
    setReservations(newReservations);
  }

  function searchReservationByPhoneNumber() {
    if (phoneNumber === "") {
      return;
    }
    (async () => {
      const newReservations = await getReservationsByPhoneNumber(phoneNumber);
      setReservations(newReservations);
    })();
  }

  monthlyRevenue.current = reservations
    .reduce(
      (acc, cur) =>
        acc +
        (cur.status === "미용완료" ? cur.price + cur.additional_price : 0),
      0,
    )
    .toLocaleString();
  return (
    <div className="w-full h-full mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-6 p-4">
        <h1 className="text-2xl font-semibold">예약</h1>
      </div>

      <Tabs value={view} onValueChange={setView} className="w-full flex-grow">
        <div className="flex items-center gap-4 mb-4 px-4">
          <TabsList>
            <TabsTrigger value="calendar">캘린더</TabsTrigger>
            <TabsTrigger value="list">리스트</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 ml-auto">
            <span className="flex border rounded-sm px-2 justify-between">
              <Input
                type="text"
                className="border-none"
                value={phoneNumber}
                placeholder="전화번호로 검색하기"
                onChange={(e) => setPhoneNumber(e.target.value)}
              ></Input>
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setPhoneNumber("");
                  }}
                >
                  <X className="h-3 w-3" color="gray" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={searchReservationByPhoneNumber}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </span>
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
        <TabsContent value="list">
          <div className="h-[calc(100vh-8.5rem)] flex flex-col">
            <CalendarBar
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
            />
            <div className="h-[calc(100vh-12rem)] border-solid border-y-2 border-gray-200 mt-4 flex flex-col justify-between">
              <ReservationList
                reservations={reservations}
                updateReservation={updateReservation}
                deleteReservation={deleteReservation}
              />
              <div className="bg-primary/50 flex justify-between p-8 text-primary-foreground">
                <span className="font-bold text-xl">매출</span>
                <span className="font-extrabold text-xl">
                  {monthlyRevenue.current} 원
                </span>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="calendar" className="">
          <div className="flex flex-col">
            <Calendar
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              reservations={reservations}
              setReservations={setReservations}
              updateReservation={updateReservation}
            />
          </div>
        </TabsContent>
        <DefaultDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title="예약 추가하기"
        >
          <OuterReservationForm
            onSubmit={handleAddEvent}
            onCloseDialog={handleCloseDialog}
            breeds={breeds}
          />
        </DefaultDialog>
      </Tabs>
    </div>
  );
}
