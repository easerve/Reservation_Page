"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/date_picker/date_picker";
import { Reservation } from "@/types/interface";

export const editFormSchema = z.object({
  time: z.date({
    required_error: "예약 시간을 선택해주세요.",
  }),
  weight: z
    .number({
      required_error: "몸무게를 입력해주세요.",
      invalid_type_error: "올바른 숫자를 입력해주세요.",
    })
    .positive()
    .multipleOf(0.1),
  additional_service: z.string().min(1, "추가 미용 내용을 입력해주세요."),
  additional_price: z.number().nonnegative("추가 서비스 금액을 입력해주세요."),
  memo: z.string().optional(),
});

export default function EditPetForm(props: {
  reservation: Reservation;
  onSubmit: (data: z.infer<typeof editFormSchema>) => void;
  updateReservation: (id: string, data: Partial<Reservation>) => void;
  onCloseDialog: () => void;
}) {
  const form = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      time: new Date(props.reservation.time),
      weight: props.reservation.weight,
      additional_service: props.reservation.additional_services,
      additional_price: props.reservation.additional_price,
      memo: props.reservation.memo,
    },
  });

  const handleFormSubmit = async (data: z.infer<typeof editFormSchema>) => {
    try {
      const response = await fetch(
        `/api/reservations?id=${props.reservation.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ReservationInfo: {
              memo: data.memo,
              additional_services: data.additional_service,
              additional_price: data.additional_price,
              reservation_date: data.time.toISOString(),
            },
          }),
        },
      );
      console.log(response);

      if (response.ok) {
        props.updateReservation(props.reservation.id, {
          memo: data.memo,
          additional_services: data.additional_service,
          additional_price: data.additional_price,
          time: data.time,
        });
        props.onCloseDialog();
      } else {
        console.error("Failed to update reservation");
      }
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>예약 시간</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "yyyy년 MM월 dd일 HH:mm")
                      ) : (
                        <span>날짜와 시간을 선택하세요</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                  <div className="p-3 border-t">
                    <Input
                      type="time"
                      onChange={(e) => {
                        const date = field.value || new Date();
                        const [hours, minutes] = e.target.value.split(":");
                        date.setHours(parseInt(hours), parseInt(minutes));
                        field.onChange(date);
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>몸무게 (kg)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.1"
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? "" : parseFloat(e.target.value),
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="additional_service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>추가 미용</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="미용 내용을 간단히 작성해주세요."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="additional_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>추가 비용</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="1"
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? "" : parseInt(e.target.value),
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="memo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>특이사항</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="특이사항이 있다면 작성해주세요."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" className="w-4/5 mr-2">
            예약하기
          </Button>
          <Button
            type="button"
            onClick={props.onCloseDialog}
            variant="secondary"
            className="w-1/5"
          >
            닫기
          </Button>
        </div>
      </form>
    </Form>
  );
}
