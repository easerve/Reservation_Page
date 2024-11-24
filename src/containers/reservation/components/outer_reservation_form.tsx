"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import Select from "react-select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/date_picker/date_picker";
import { Dog, Customer } from "@/types/booking";

export const outerFormSchema = z.object({
  time: z.date({
    required_error: "예약 시간을 선택해주세요.",
  }),
  phone: z.string().regex(/^[0-9]{11}$/, {
    message: "올바른 전화번호 형식을 입력해주세요 (11자리 숫자).",
  }),
  name: z.string().min(1, "동물 이름을 입력해주세요."),
  breed: z.string({
    required_error: "견종을 선택해주세요.",
  }),
  weight: z
    .number({
      required_error: "몸무게를 입력해주세요.",
      invalid_type_error: "올바른 숫자를 입력해주세요.",
    })
    .positive()
    .multipleOf(0.1),
  birth: z.date({
    required_error: "생일을 선택해주세요.",
  }),
  service_name: z.string().min(1, "미용 내용을 입력해주세요."),
  additional_service: z.string().min(1, "추가 미용 내용을 입력해주세요."),
  additional_price: z.number().nonnegative("추가 서비스 금액을 입력해주세요."),
  memo: z.string().optional(),
});

export default function OuterReservationForm(props: {
  onSubmit: (data: z.infer<typeof outerFormSchema>) => void;
  onCloseDialog: () => void;
  breeds: { id: number; name: string; type: number }[];
}) {
  const [showDogList, setShowDogList] = useState(false);
  const [userDogsData, setUserDogsData] = useState({
    status: "" as string,
    customers: {
      id: "" as string,
      name: "" as string,
      phone: "" as string,
      address: "" as string,
      detailAddress: "" as string,
      dogs: [] as Dog[],
    } as Customer,
  });
  const [selectedDog, setSelectedDog] = useState<Dog>();
  const form = useForm<z.infer<typeof outerFormSchema>>({
    resolver: zodResolver(outerFormSchema),
    defaultValues: {
      phone: "",
      name: "",
      service_name: "",
      weight: 0,
      additional_price: 0,
    },
  });
  const { control, handleSubmit, setValue } = form;

  // const { control, handleSubmit, setValue } = useForm<
  //   z.infer<typeof outerFormSchema>
  // >({
  //   resolver: zodResolver(outerFormSchema),
  //   defaultValues: {
  //     phone: "",
  //     name: "",
  //     breed: "",
  //     weight: 0,
  //     birth: new Date(),
  //     // neutering: false,
  //     // sex: "",
  //     // regNumber: "",
  //   },
  // });

  const handleDogSelect = (dog: Dog) => {
    setSelectedDog(dog);
    setValue("name", dog.petName);
    setValue("breed", dog.breed.toString());
    setValue("weight", dog.weight);
    setValue("birth", new Date(dog.birth));
    // setValue("neutering", dog.neutering);
    // setValue("sex", dog.sex);
    // setValue("regNumber", dog.regNumber);
  };

  async function getUserData(values) {
    try {
      const res = await fetch("api/auth/profile?phone=" + values);
      const data = await res.json();

      setUserDogsData(data);
    } catch (error) {
      console.error(error);
    }
  }

  function onSubmit(data: z.infer<typeof outerFormSchema>) {
    console.log("submit done");
    props.onSubmit(data);
  }

  const toggleDogList = async (phoneNumber) => {
    if (!phoneNumber) {
      return;
    }
    await getUserData(phoneNumber);
    setShowDogList(true);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        !field.value && "text-muted-foreground"
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>전화번호</FormLabel>
              <div className="flex items-center">
                <FormControl className="flex-1">
                  <Input {...field} placeholder="01012345678" />
                </FormControl>
                <Button
                  type="button"
                  className="ml-2"
                  onClick={() => {
                    toggleDogList(field.value);
                  }}
                >
                  강아지 찾기
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {showDogList && userDogsData.status === "fail" ? (
          <div>검색결과가 없습니다</div>
        ) : (
          showDogList && (
            <div className="overflow-hidden transition-all duration-500 ease-in-out">
              <CardContent className="p-0">
                {userDogsData.customers.dogs.map((dog, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className={`w-full justify-between h-auto py-4 ${
                      selectedDog && selectedDog.petName === dog.petName
                        ? "border-primary bg-primary/10"
                        : ""
                    }`}
                    onClick={() => {
                      handleDogSelect(dog);
                    }}
                  >
                    <div className="text-left">
                      <p>이름: {dog.petName}</p>
                      <p>견종: {dog.breed}</p>
                      <p>
                        나이:
                        {(() => {
                          const birthDate = new Date(dog.birth);
                          const today = new Date();
                          const months =
                            (today.getFullYear() - birthDate.getFullYear()) *
                              12 +
                            (today.getMonth() - birthDate.getMonth());
                          const years = Math.floor(months / 12);
                          const remainingMonths = months % 12;

                          return ` ${years}년${remainingMonths}개월`;
                        })()}
                      </p>
                      <p>체중: {dog.weight}kg</p>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </div>
          )
        )}
        <FormField
          control={form.control}
          name="name"
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
              <FormControl>
                <Controller
                  name="breed"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      options={props.breeds.map((breed) => ({
                        id: breed.id,
                        name: breed.name,
                        type: breed.type,
                      }))}
                      isSearchable
                      isClearable
                      placeholder="견종을 선택하세요"
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.name.toString()}
                      value={props.breeds.find(
                        (breed) => breed.name === field.value
                      )} // 선택된 값
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.name); // 선택된 옵션의 ID를 form 상태로 업데이트
                      }}
                      isDisabled={false}
                    />
                  )}
                />
              </FormControl>
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
                      e.target.value === "" ? "" : parseFloat(e.target.value)
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
          name="birth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>생일</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "yyyy년 MM월 dd일 HH:mm")
                      ) : (
                        <span>생일을 선택하세요</span>
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
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="service_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>기본 미용</FormLabel>
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
                      e.target.value === "" ? "" : parseInt(e.target.value)
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
