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
import { Appointment } from "@/types/interface";


export default function ReservationList(props: { appointments: Appointment[], setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>> }) {

  const [editingField, setEditingField] = useState<{
    id: string;
    field: "weight" | "service_name" | "memo" | "price" | null;
  }>({ id: "", field: null });

  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleEdit = (
    id: string,
    field: "weight" | "service_name" | "memo" | "price",
    value: string | number
  ) => {
    props.setAppointments((prev: Appointment[]) =>
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

  const groupedAppointments = props.appointments.reduce((groups, appointment) => {
    const date = appointment.time;
    const dateString = date.toDateString();
    console.log("date: ", date);
    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    groups[dateString].push(appointment);
    return groups;
  }, {} as Record<string, Appointment[]>);

  return (
    <div className="overflow-x-auto">
      <div className="bg-white rounded-lg shadow min-w-[1000px]">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 font-semibold bg-gray-50 border-b">
          <div className="text-sm">시간</div>
          <div className="text-sm">견종</div>
          <div className="text-sm">이름</div>
          <div className="text-sm">몸무게</div>
          <div className="text-sm">나이</div>
          <div className="text-sm col-span-2">전화번호</div>
          <div className="text-sm col-span-2">기본 미용</div>
          <div className="text-sm col-span-2">추가 미용</div>
          <div className="text-sm col-span-2">특이사항</div>
          <div className="text-sm">기본 가격</div>
          <div className="text-sm">추가 가격</div>
          <div className="text-sm">총합</div>
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
                  <div className="text-sm">{getTimeString2(appointment.time)}</div>
                  <div className="text-sm">{appointment.breed}</div>
                  <div className="text-sm">{appointment.name}</div>
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
                          setEditingField({ id: "", field: null });
                        }}
                        autoFocus
                      />
                    ) : (
                      `${appointment.weight}kg`
                    )}
                  </div>
                  <div className="text-sm">{`${getAge2(appointment.birth).years}년 ${getAge2(appointment.birth).months}개월`}</div>
                  <div className="text-sm col-span-2">{appointment.phone}</div>
                  <div
                    className="text-sm cursor-pointer col-span-2"
                    onClick={() =>
                      setEditingField({
                        id: appointment.id,
                        field: "service_name",
                      })
                    }
                  >
                    {editingField.id === appointment.id &&
                      editingField.field === "service_name" ? (
                      <Input
                        defaultValue={appointment.service_name}
                        onBlur={(e) => {
                          handleEdit(
                            appointment.id,
                            "service_name",
                            e.target.value
                          );
                          setEditingField({ id: "", field: null });
                        }}
                        autoFocus
                      />
                    ) : (
                      appointment.service_name
                    )}
                  </div>
                  <div
                    className="text-sm cursor-pointer col-span-2"
                    onClick={() =>
                      setEditingField({
                        id: appointment.id,
                        field: "memo",
                      })
                    }
                  >
                    {editingField.id === appointment.id &&
                      editingField.field === "memo" ? (
                      <Input
                        defaultValue={appointment.memo}
                        onBlur={(e) => {
                          handleEdit(
                            appointment.id,
                            "memo",
                            e.target.value
                          );
                          setEditingField({ id: "", field: null });
                        }}
                        autoFocus
                      />
                    ) : (
                      appointment.memo
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
                          setEditingField({ id: "", field: null });
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
    </div>
  );
}
