"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
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

import { Reservation } from "@/types/interface";

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
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuGroup } from "@/components/ui/dropdown-menu";

type GroupedReservations = {
  [key: string]: Reservation[];
};

export default function ReservationList(props: {
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null);
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
    {}
  );

  const handleRowClick = (id: string) => {
    console.log("row clicked: ", id);
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
    console.log("editing reservation: ", reservation);
    setIsDialogOpen(true);
  };

  const handleSave = (id: string, updatedData: Partial<Reservation>) => {
    if (editingReservation) {
      props.setReservations(
        props.reservations.map((reservation) =>
          reservation.id === editingReservation.id
            ? { ...reservation, ...updatedData }
            : reservation
        )
      );
      setIsDialogOpen(false);
      setEditingReservation(null);
    }
  };

  const handleClose = (id: string) => {
    props.setReservations(
      props.reservations.filter((reservation) => reservation.id !== id)
    );
  };

  function handleSubmit(data: z.infer<typeof editFormSchema>) {
    console.log("submit done: ", data);
    handleSave(editingReservation!.id, data);
  }

  return (
    <div className="w-full h-[60vh] overflow-y-auto scrollbar-hide flex-grow">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-white">
          <TableRow className="whitespace-nowrap">
            <TableHead>예약 시간</TableHead>
            <TableHead>견종</TableHead>
            <TableHead>이름</TableHead>
            <TableHead>몸무게</TableHead>
            <TableHead>나이</TableHead>
            <TableHead>전화번호</TableHead>
            <TableHead>기본 미용</TableHead>
            <TableHead>추가 미용</TableHead>
            <TableHead>특이사항</TableHead>
            <TableHead>예약 상태</TableHead>
            <TableHead>기본 가격</TableHead>
            <TableHead>추가 가격</TableHead>
            <TableHead>총계</TableHead>
            <TableHead className="w-[100px]">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(groupedReservations).map(
            ([date, dateReservations]) => (
              <React.Fragment key={`date-${date}`}>
                <TableRow>
                  <TableCell colSpan={14} className="font-bold bg-primary/5">
                    {format(new Date(date), "M월 d일 eeee", { locale: ko })}
                  </TableCell>
                </TableRow>
                {dateReservations.map((reservation) => (
                  <TableRow
                    key={reservation.id}
                    className="whitespace-nowrap"
                    onClick={() => handleRowClick(reservation.id)}
                  >
                    <TableCell>{getTimeString2(reservation.time)}</TableCell>
                    <TableCell>{reservation.breed}</TableCell>
                    <TableCell>{reservation.name}</TableCell>
                    <TableCell>{`${reservation.weight}kg`}</TableCell>
                    <TableCell>{`${getAge2(reservation.birth).years}년 ${
                      getAge2(reservation.birth).months
                    }개월`}</TableCell>
                    <TableCell>{reservation.phone}</TableCell>
                    <TableCell>{reservation.service_name.join(", ")}</TableCell>
                    <TableCell>{reservation.additional_service}</TableCell>
                    <TableCell>
                      {reservation.memo.length < 10
                        ? reservation.memo
                        : `${reservation.memo.slice(0, 9)}...`}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                          >
                            {reservation.status}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white border border-solid p-2 rounded-sm mt-2">
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup>
                            <DropdownMenuRadioItem
                              value="top"
                              className="hover: border-none"
                            >
                              Top
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="bottom">
                              Bottom
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="right">
                              Right
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      {reservation.price.toLocaleString()}원
                    </TableCell>
                    <TableCell>
                      {reservation.additional_price.toLocaleString()}원
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
                ))}
              </React.Fragment>
            )
          )}
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
            onCloseDialog={() => setIsDialogOpen(false)}
          />
        )}
      </DefaultDialog>
    </div>
  );
}
