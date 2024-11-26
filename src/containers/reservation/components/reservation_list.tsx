"use client";

import React, { useState } from "react";
import { Dot, X } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ReservationStatus } from "@/types/interface";

import { getTimeString2, getAge2 } from "@/components/utils/date_utils";
import DefaultDialog from "@/components/default_dialog/default_dialog";
import OuterReservationForm from "./outer_reservation_form";
import EditReservationForm, { editFormSchema } from "./edit_reservation_form";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import exp from "constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFullAddress, getTrimmedStr } from "@/utils/functions";
import { updateReservationState } from "@/services/admin/put";
import { deleteReservation } from "@/services/admin/delete";
import { ReservationInfo } from "@/types/api";

type GroupedReservations = {
  [key: string]: ReservationInfo[];
};

export default function ReservationList(props: {
  reservations: ReservationInfo[];
  updateReservation: (id: string, data: Partial<ReservationInfo>) => void;
  deleteReservation: (id: string) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] =
    useState<ReservationInfo | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const groupedReservations = props.reservations.reduce<GroupedReservations>(
    (groups, reservation) => {
      const date = reservation.time;
      const dateStr = date.toDateString();
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(reservation);
      return groups;
    },
    {},
  );

  const groupedReservationsArray = Object.entries(groupedReservations).sort(
    ([a], [b]) => new Date(a).getTime() - new Date(b).getTime(),
  );

  groupedReservationsArray.forEach(([date, reservations]) => {
    reservations.sort((a, b) => a.time.getTime() - b.time.getTime());
  });

  const handleRowClick = (id: string) => {
    console.log("row clicked: ", id);
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const handleEdit = (reservation: ReservationInfo) => {
    setEditingReservation(reservation);
    console.log("editing reservation: ", reservation);
    setIsDialogOpen(true);
  };

  const handleSave = (id: string, updatedData: Partial<ReservationInfo>) => {
    if (editingReservation) {
      props.updateReservation(id, updatedData);
      setIsDialogOpen(false);
      setEditingReservation(null);
    }
  };

  const handleClose = (id: string) => {
    deleteReservation(id);
    props.deleteReservation(id);
  };

  function handleSubmit(data: z.infer<typeof editFormSchema>) {
    console.log("submit done: ", data);
    handleSave(editingReservation!.id, data);
  }

  const headers = [
    "예약 시간",
    "견종",
    "이름",
    "몸무게",
    "나이",
    "전화번호",
    "기본 미용",
    "추가 미용",
    "특이사항",
    "예약 상태",
    "기본 가격",
    "추가 가격",
    "총계",
    "관리",
  ];

  return (
    <div className="h-[calc(100vh-18rem)]">
      <Table>
        <TableHeader className="sticky top-0 bg-white">
          <TableRow className="whitespace-nowrap">
            {headers.map((header, idx) => (
              <TableHead key={idx}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedReservationsArray.map(([date, dateReservations]) => (
            <React.Fragment key={`date-${date}`}>
              <TableRow>
                <TableCell colSpan={14} className="font-bold bg-primary/5">
                  {format(new Date(date), "M월 d일 eeee", { locale: ko })}
                </TableCell>
              </TableRow>
              {dateReservations.map((reservation) => (
                <React.Fragment key={reservation.id}>
                  <TableRow
                    key={reservation.id}
                    className="whitespace-nowrap"
                    onClick={() => handleRowClick(reservation.id)}
                  >
                    <TableCell>{getTimeString2(reservation.time)}</TableCell>
                    <TableCell>{reservation.pets.breeds.name}</TableCell>
                    <TableCell>{reservation.pets.name}</TableCell>
                    <TableCell>{`${reservation.pets.weight}kg`}</TableCell>
                    <TableCell>{`${getAge2(reservation.pets.birth).years}년 ${
                      getAge2(reservation.pets.birth).months
                    }개월`}</TableCell>
                    <TableCell>{reservation.pets.user.phone}</TableCell>
                    <TableCell>
                      {getTrimmedStr(reservation.services, 20)}
                    </TableCell>
                    <TableCell>
                      {getTrimmedStr(reservation.additional_services, 20)}
                    </TableCell>
                    <TableCell>{getTrimmedStr(reservation.memo, 10)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`rounded-full ${
                              ReservationStatus.find(
                                (status) => status.value === reservation.status,
                              )?.css
                            } font-extrabold`}
                          >
                            {reservation.status}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="">
                          <DropdownMenuRadioGroup
                            value={reservation.status}
                            onValueChange={(value) => {
                              console.log("onValueChange: ", value);
                              updateReservationState(reservation.id, {
                                status: value,
                              }).then((res) => {
                                if (res) {
                                  props.updateReservation(reservation.id, {
                                    status: value,
                                  });
                                }
                              });
                            }}
                            className="p-2"
                          >
                            {ReservationStatus.map((status) => (
                              <DropdownMenuRadioItem
                                key={status.value}
                                value={status.value}
                                className={`${status.css} py-1 px-3 rounded-full m-1 cursor-pointer justify-center`}
                                onClick={(event) => {
                                  event.stopPropagation();
                                }}
                              >
                                <div className="flex font-bold text-[0.7rem]">
                                  {status.value}
                                </div>
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      {reservation.price?.toLocaleString()}원
                    </TableCell>
                    <TableCell>
                      {reservation.additional_price?.toLocaleString()}원
                    </TableCell>
                    <TableCell>
                      {`${(
                        reservation.price + reservation.additional_price
                      ).toLocaleString()}원`}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(reservation)}
                        >
                          수정
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleClose(reservation.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    className={`${
                      expandedRow === reservation.id
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0 hidden"
                    } overflow-hidden transition-all duration-300 ease-in-out`}
                  >
                    <TableCell colSpan={headers.length}>
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                          {reservation.pets.name}
                        </CardTitle>
                        <CardDescription>
                          {reservation.pets.breeds.name} •{" "}
                          {reservation.pets.weight}
                          kg
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2">
                            {`기본 미용: ${reservation.services}`}
                          </h4>
                          <h4 className="text-sm font-semibold mb-2">
                            {`추가 미용: ${reservation.additional_services}`}
                          </h4>
                          <h4 className="text-sm font-semibold mb-2">
                            {`주소: ${getFullAddress(reservation.pets.user)}`}
                          </h4>
                          <h4 className="text-sm font-semibold mb-2">
                            특이사항
                          </h4>
                          <p className="text-sm text-gray-600">
                            {reservation.memo}
                          </p>
                        </div>
                      </CardContent>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <DefaultDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="예약 수정하기"
      >
        {editingReservation && (
          <EditReservationForm
            reservation={editingReservation}
            onSubmit={handleSubmit}
            updateReservation={props.updateReservation}
            onCloseDialog={() => setIsDialogOpen(false)}
          />
        )}
      </DefaultDialog>
    </div>
  );
}
