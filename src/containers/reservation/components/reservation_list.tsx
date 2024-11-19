"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

interface Appointment {
  id: number;
  date: string;
  time: string;
  petType: string;
  petName: string;
  weight: number;
  age: {
    years: number;
    months: number;
  };
  phone: string;
  groomingInfo: string;
  specialNotes: string;
  price: number;
}

export default function ReservationList() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      date: "2024-12-01",
      time: "오전 10:00",
      petType: "포메라니안",
      petName: "둥둥이",
      weight: 4.4,
      age: { years: 2, months: 4 },
      phone: "01012341234",
      groomingInfo:
        "동물이의 앞발에 작은 상처가 있어요. 샴푸는 저자극성으로 사용해주세요.",
      specialNotes: "알러지 있음. 간식은 주지 말아주세요.",
      price: 50000,
    },
    {
      id: 2,
      date: "2024-12-01",
      time: "오전 11:00",
      petType: "말티즈",
      petName: "몽몽이",
      weight: 3.2,
      age: { years: 1, months: 8 },
      phone: "01098765432",
      groomingInfo:
        "털이 많이 엉켜있어요. 부드럽게 빗질해주세요. 발톱도 깎아주세요.",
      specialNotes: "겁이 많음. 천천히 다가가주세요.",
      price: 45000,
    },
    // Add more sample data as needed
  ]);

  const [editingField, setEditingField] = useState<{
    id: number | null;
    field: "weight" | "groomingInfo" | "specialNotes" | "price" | null;
  }>({ id: null, field: null });

  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleEdit = (
    id: number,
    field: "weight" | "groomingInfo" | "specialNotes" | "price",
    value: string | number
  ) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              [field]: field === "weight" ? parseFloat(value as string) : value,
            }
          : appointment
      )
    );
  };

  const groupedAppointments = appointments.reduce((groups, appointment) => {
    const date = appointment.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(appointment);
    return groups;
  }, {} as Record<string, Appointment[]>);

  return (
    <>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow"
      />

      <div className="bg-white rounded-lg shadow flex-grow">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 font-semibold bg-gray-50 border-b">
          <div className="text-sm">시간</div>
          <div className="text-sm">견종</div>
          <div className="text-sm">이름</div>
          <div className="text-sm">몸무게</div>
          <div className="text-sm">나이</div>
          <div className="text-sm col-span-2">전화번호</div>
          <div className="text-sm col-span-2">미용 정보</div>
          <div className="text-sm col-span-2">특이사항</div>
          <div className="text-sm">가격</div>
        </div>
        {Object.entries(groupedAppointments).map(([date, dateAppointments]) => (
          <div key={date} className="border-b last:border-b-0">
            <div className="bg-gray-100 px-6 py-2 font-semibold">
              {new Date(date).toLocaleDateString("ko-KR", {
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </div>
            <div className="divide-y">
              {dateAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center"
                >
                  <div className="text-sm">{appointment.time}</div>
                  <div className="text-sm">{appointment.petType}</div>
                  <div className="text-sm">{appointment.petName}</div>
                  <div
                    className="text-sm cursor-pointer"
                    onClick={() =>
                      setEditingField({
                        id: appointment.id,
                        field: "weight",
                      })
                    }
                  >
                    {editingField.id === appointment.id &&
                    editingField.field === "weight" ? (
                      <Input
                        type="number"
                        step="0.1"
                        defaultValue={appointment.weight}
                        onBlur={(e) => {
                          handleEdit(appointment.id, "weight", e.target.value);
                          setEditingField({ id: null, field: null });
                        }}
                        autoFocus
                      />
                    ) : (
                      `${appointment.weight}kg`
                    )}
                  </div>
                  <div className="text-sm">{`${appointment.age.years}년 ${appointment.age.months}개월`}</div>
                  <div className="text-sm col-span-2">{appointment.phone}</div>
                  <div
                    className="text-sm cursor-pointer col-span-2"
                    onClick={() =>
                      setEditingField({
                        id: appointment.id,
                        field: "groomingInfo",
                      })
                    }
                  >
                    {editingField.id === appointment.id &&
                    editingField.field === "groomingInfo" ? (
                      <Input
                        defaultValue={appointment.groomingInfo}
                        onBlur={(e) => {
                          handleEdit(
                            appointment.id,
                            "groomingInfo",
                            e.target.value
                          );
                          setEditingField({ id: null, field: null });
                        }}
                        autoFocus
                      />
                    ) : (
                      appointment.groomingInfo
                    )}
                  </div>
                  <div
                    className="text-sm cursor-pointer col-span-2"
                    onClick={() =>
                      setEditingField({
                        id: appointment.id,
                        field: "specialNotes",
                      })
                    }
                  >
                    {editingField.id === appointment.id &&
                    editingField.field === "specialNotes" ? (
                      <Input
                        defaultValue={appointment.specialNotes}
                        onBlur={(e) => {
                          handleEdit(
                            appointment.id,
                            "specialNotes",
                            e.target.value
                          );
                          setEditingField({ id: null, field: null });
                        }}
                        autoFocus
                      />
                    ) : (
                      appointment.specialNotes
                    )}
                  </div>
                  <div
                    className="text-sm cursor-pointer"
                    onClick={() =>
                      setEditingField({
                        id: appointment.id,
                        field: "price",
                      })
                    }
                  >
                    {editingField.id === appointment.id &&
                    editingField.field === "price" ? (
                      <Input
                        type="number"
                        defaultValue={appointment.price}
                        onBlur={(e) => {
                          handleEdit(appointment.id, "price", e.target.value);
                          setEditingField({ id: null, field: null });
                        }}
                        autoFocus
                      />
                    ) : (
                      `₩${appointment.price.toLocaleString()}`
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
