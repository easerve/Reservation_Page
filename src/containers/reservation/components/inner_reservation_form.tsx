"use client";

import { useState } from "react";
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

export const innerFormSchema = z.object({
  reservationTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "올바른 시간 형식을 입력해주세요 (HH:MM).",
  }),
  phoneNumber: z.string().regex(/^[0-9]{11}$/, {
    message: "올바른 전화번호 형식을 입력해주세요 (11자리 숫자).",
  }),
  petName: z.string().min(1, "동물 이름을 입력해주세요."),
  breed: z.enum(["말티즈", "포메라니안", "시츄", "믹스"], {
    required_error: "견종을 선택해주세요.",
  }),
  weight: z
    .number({
      required_error: "몸무게를 입력해주세요.",
      invalid_type_error: "올바른 숫자를 입력해주세요.",
    })
    .positive()
    .multipleOf(0.1),
  groomingDetails: z.string().min(1, "미용 내용을 입력해주세요."),
  specialNotes: z.string().optional(),
});

export default function InnerReservationForm(props: {
  onSubmit: (data: z.infer<typeof innerFormSchema>) => void;
  onCloseDialog: () => void;
}) {
  const form = useForm<z.infer<typeof innerFormSchema>>({
    resolver: zodResolver(innerFormSchema),
    defaultValues: {
      reservationTime: "",
      phoneNumber: "",
      petName: "",
      groomingDetails: "",
      specialNotes: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="reservationTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>예약 시간</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>전화번호</FormLabel>
              <FormControl>
                <Input {...field} placeholder="01012345678" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="petName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>동물 이름</FormLabel>
              <FormControl>
                <Input {...field} placeholder="반려동물 이름을 입력하세요" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="breed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>견종</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="견종을 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="말티즈">말티즈</SelectItem>
                  <SelectItem value="포메라니안">포메라니안</SelectItem>
                  <SelectItem value="시츄">시츄</SelectItem>
                  <SelectItem value="믹스">믹스</SelectItem>
                </SelectContent>
              </Select>
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
                  type="number"
                  step="0.1"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="groomingDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>미용 내용</FormLabel>
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
          name="specialNotes"
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
