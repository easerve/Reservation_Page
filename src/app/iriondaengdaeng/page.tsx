"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Select from "react-select";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BookingData, BookingService, OptionInfo } from "@/types/booking";
// import { fetchBreeds } from "@/api/pets/breed"; // Assume this API call fetches breed data

export default function IrionBooking() {
  const [currentStep, setCurrentStep] = useState(1);

  // Move booking state from context to component
  const [bookingData, setBookingData] = useState<BookingData>({
    dateTime: {
      date: undefined as Date | undefined,
      time: undefined as string | undefined,
    },
    petInfo: { petName: "", weight: 0, phoneNumber: "", age: 0, breed: "" },
    mainService: [],
    additionalServices: [],
    price: 0,
    inquiry: "",
  });

  const [userDogsData, setUserDogsData] = useState(null);

  // Create state update functions
  const updateDateTime = (date: Date | undefined, time: string | undefined) => {
    setBookingData((prev) => ({ ...prev, dateTime: { date, time } }));
  };

  const updatePetInfo = (info: {
    petName?: string;
    weight?: number;
    phoneNumber?: string;
    age?: number;
    breed?: string;
  }) => {
    setBookingData((prev) => ({
      ...prev,
      petInfo: {
        ...prev.petInfo,
        ...info,
      },
    }));
  };

  const updateMainServices = (mainService: BookingService) => {
    setBookingData((prev) => ({ ...prev, mainService }));
  };

  const updateAdditionalService = (additionalServices: BookingService[]) => {
    setBookingData((prev) => ({ ...prev, additionalServices }));
  };

  const updateInquiry = (text: string) => {
    setBookingData((prev) => ({ ...prev, inquiry: text }));
  };

  // Replace existing state declarations with values from bookingData
  const [date, setDate] = useState<Date | undefined>(bookingData.dateTime.date);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    bookingData.dateTime.time
  );

  // Step 2: Phone Number Form Schema
  const phoneNumberSchema = z.object({
    phoneNumber: z.string().min(10, "올바른 전화번호를 입력해주세요"),
  });

  // Step 3: Pet Info Form Schema
  const petInfoSchema = z.object({
    petName: z.string().min(1, "반려견의 이름을 입력해주세요"),
    weight: z
      .string()
      .min(1, "반려견의 체중을 입력해주세요")
      .refine((value) => Number(value) >= 0, {
        message: "체중은 0 이상이어야 합니다",
      }),
    age: z
      .string()
      .min(1, "반려견의 나이를 입력해주세요")
      .refine((value) => Number(value) >= 0, {
        message: "나이는 0 이상이어야 합니다",
      }),
    breed: z.string().min(1, "반려견의 견종을 선택해주세요"),
  });

  const phoneNumberForm = useForm<z.infer<typeof phoneNumberSchema>>({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      phoneNumber: bookingData.petInfo.phoneNumber,
    },
  });

  const petInfoForm = useForm<z.infer<typeof petInfoSchema>>({
    resolver: zodResolver(petInfoSchema),
    defaultValues: {
      petName: bookingData.petInfo.petName,
      weight: String(bookingData.petInfo.weight),
      age: String(bookingData.petInfo.age),
      breed: bookingData.petInfo.breed,
    },
  });

  const [breeds, setBreeds] = useState<{ id: number; breed: string }[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<{
    id: number;
    breed: string;
  } | null>(null);

  const getDogsData = async (): Promise<any> => {
    const res = await fetch("http://localhost:3000/api/auth/profile");
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    const loadBreeds = async () => {
      try {
        // const breedData = await fetchBreeds(); //temp
        const breedOptions = breedDummyData.breed;
        setBreeds(breedOptions);
      } catch (error) {
        console.error("Error fetching breeds:", error);
      }
    };
    loadBreeds();
  }, []);

  // Step 3: Services Selection
  const [selectedMainService, setSelectedMainService] = useState<
    BookingService | undefined
  >();
  const [selectedSubOptions, setSelectedSubOptions] = useState<OptionInfo[]>(
    []
  );
  const [selectedAdditionalOptions, setSelectedAdditionalOptions] = useState<
    BookingService[]
  >([]);
  const [selectedAdditionalSubOptions, setSelectedAdditionalSubOptions] =
    useState<OptionInfo[]>([]);

  // Step 4: Inquiry
  const [inquiry, setInquiry] = useState(bookingData.inquiry);

  // Services data
  const mainServices: BookingService[] = [
    {
      id: "grooming",
      name: "위생미용+목욕",
      price: 25000,
      options: [
        { id: "shampoo", name: "샴푸 업그레이드", addPrice: 10000 },
        { id: "perfume", name: "향수 추가", addPrice: 5000 },
      ],
    },
    {
      id: "clipping",
      name: "클리핑",
      price: 25000,
      options: [
        { id: "nailTrim", name: "발톱 정리", addPrice: 5000 },
        { id: "earCleaning", name: "귀 청소", addPrice: 8000 },
      ],
    },
    {
      id: "sporting",
      name: "스포팅",
      price: 15000,
      options: [],
    },
    {
      id: "scissorCut",
      name: "가위컷",
      price: 15000,
      options: [],
    },
  ];

  const additionalServices: BookingService[] = [
    { id: "instep", name: "발등", price: 5000, options: [] },
    { id: "tangle", name: "엉킴", price: 10000, options: [] },
  ];

  // Add helper functions for confirmation page
  const formatDate = (date: Date | undefined) => {
    if (!date) return "날짜 미선택";
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getServiceNames = (
    mainService: string,
    subOptions: string[],
    additionalOptions: string[]
  ) => {
    const allServices = [mainService, ...subOptions, ...additionalOptions];
    const serviceMap: { [key: string]: string } = {
      grooming: "위생미용+목욕",
      clipping: "클리핑",
      sporting: "스포팅",
      scissorCut: "가위컷",
      instep: "발등",
      tangle: "엉킴",
      shampoo: "샴푸 업그레이드",
      perfume: "향수 추가",
      nailTrim: "발톱 정리",
      earCleaning: "귀 청소",
    };
    return allServices.map((id) => serviceMap[id] || id).join(", ");
  };

  const breedDummyData = {
    breed: [
      {
        id: 1,
        breed: "포메",
      },
      {
        id: 2,
        breed: "비숑",
      },
      {
        id: 3,
        breed: "진돗개",
      },
    ],
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>날짜 및 시간 선택</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {["09:00", "09:30", "10:00", "10:30", "11:00"].map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={selectedTime === time ? "bg-[#415036]" : ""}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Button
              className="w-full bg-[#415036]"
              onClick={() => {
                updateDateTime(date, selectedTime);
                setCurrentStep(2);
              }}
              disabled={!date || !selectedTime}
            >
              다음
            </Button>
          </div>
        );
      case 2:
        return (
          <Form {...phoneNumberForm}>
            <form
              onSubmit={phoneNumberForm.handleSubmit(async (values) => {
                updatePetInfo({ phoneNumber: values.phoneNumber });
                try {
                  const res = await fetch(
                    "http://localhost:3000/api/auth/profile?phone=" +
                      values.phoneNumber
                  );
                  const data = await res.json();
                  setUserDogsData(data);
                } catch {
                  console.log("fail");
                }
                setCurrentStep(3);
              })}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>보호자 전화번호</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={phoneNumberForm.control}
                    name="phoneNumber"
                    render={({ field: fieldProps }) => (
                      <FormItem>
                        <FormLabel>전화번호</FormLabel>
                        <FormControl>
                          <Input type="text" {...fieldProps} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  이전
                </Button>
                <Button type="submit" className="flex-1 bg-[#415036]">
                  다음
                </Button>
              </div>
            </form>
          </Form>
        );

      case 3:
        const getFieldLabel = (field: string) => {
          if (field === "petName") {
            return "반려견 이름";
          } else if (field === "weight") {
            return "반려견 체중 (kg)";
          } else if (field === "age") {
            return "반려견 나이";
          } else if (field === "breed") {
            return "반려견 견종";
          }
          return "";
        };

        return (
          <Form {...petInfoForm}>
            <form
              onSubmit={petInfoForm.handleSubmit((values) => {
                updatePetInfo({
                  petName: values.petName,
                  weight: Number(values.weight),
                  age: Number(values.age),
                  breed: selectedBreed ? selectedBreed.breed : "",
                });
                setCurrentStep(4);
              })}
              className="space-y-6"
            >
              {userDogsData.status === "success" ? (
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>반려견 선택</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {userDogsData.customers.dogs.map((dog) => (
                        <Button
                          key={dog.id}
                          variant="outline"
                          className={`w-full justify-between h-auto py-4 ${
                            bookingData.petInfo.petName === dog.name
                              ? "border-[#415036] bg-[#415036]/10"
                              : ""
                          }`}
                          onClick={() => {
                            updatePetInfo({
                              petName: dog.name,
                              weight: dog.weight,
                              age: dog.age,
                              breed: dog.breed,
                            });
                          }}
                        >
                          <div>
                            <p>이름: {dog.name}</p>
                            <p>견종: {dog.breed}</p>
                            <p>나이: {dog.age}살</p>
                            <p>체중: {dog.weight}kg</p>
                          </div>
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        className={`w-full justify-between h-auto py-4`}
                        // onClick={}
                      >
                        <div>강아지 추가하기</div>
                      </Button>
                    </CardContent>
                  </Card>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                    >
                      이전
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(4)}
                      className="flex-1 bg-[#415036]"
                    >
                      다음
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>반려견 선택</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {["petName", "weight", "age"].map((field) => (
                        <FormField
                          key={field}
                          control={petInfoForm.control}
                          name={field as any}
                          render={({ field: fieldProps }) => (
                            <FormItem>
                              <FormLabel>{getFieldLabel(field)}</FormLabel>
                              <FormControl>
                                <Input
                                  type={field === "petName" ? "text" : "number"}
                                  {...fieldProps}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                      <FormField
                        control={petInfoForm.control}
                        name="breed"
                        render={({ field: fieldProps }) => (
                          <FormItem>
                            <FormLabel>반려견 견종</FormLabel>
                            <FormControl>
                              <Select
                                {...fieldProps}
                                options={breeds.map((breed) => ({
                                  value: breed.id,
                                  label: breed.breed,
                                }))}
                                isSearchable
                                isClearable
                                onChange={(option) => {
                                  setSelectedBreed(
                                    option
                                      ? breeds.find(
                                          (breed) => breed.id === option.value
                                        )
                                      : null
                                  );
                                  fieldProps.onChange(option?.label);
                                }}
                                value={
                                  selectedBreed
                                    ? {
                                        value: selectedBreed.id,
                                        label: selectedBreed.breed,
                                      }
                                    : null
                                }
                                isDisabled={false}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                    >
                      이전
                    </Button>
                    <Button type="submit" className="flex-1 bg-[#415036]">
                      다음
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>메인 서비스</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mainServices.map((service) => (
                  <div key={service.id} className="space-y-2">
                    <Button
                      variant="outline"
                      className={`w-full justify-between h-auto py-4 ${
                        selectedMainService &&
                        selectedMainService.id === service.id
                          ? "border-[#415036] bg-[#415036]/10"
                          : ""
                      }`}
                      onClick={() => {
                        if (
                          !selectedMainService ||
                          selectedMainService.id !== service.id
                        ) {
                          setSelectedMainService(service);
                          setSelectedSubOptions([]);
                        }
                      }}
                    >
                      <span>{service.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {service.price}
                      </span>
                    </Button>

                    {selectedMainService &&
                      selectedMainService.id === service.id &&
                      service.options.length > 0 && (
                        <div className="ml-4 space-y-2">
                          {service.options.map((option) => (
                            <Button
                              key={option.id}
                              variant="outline"
                              className={`w-full justify-between h-auto py-3 ${
                                selectedSubOptions.some(
                                  (optionInfo) => optionInfo.id === option.id
                                )
                                  ? "border-[#415036] bg-[#415036]/10"
                                  : ""
                              }`}
                              onClick={() => {
                                const newSubOptions = selectedSubOptions.some(
                                  (optionInfo) => optionInfo.id === option.id
                                )
                                  ? selectedSubOptions.filter(
                                      (optionInfo) =>
                                        optionInfo.id !== option.id
                                    )
                                  : [...selectedSubOptions, option];
                                setSelectedSubOptions(newSubOptions);
                              }}
                            >
                              <span className="text-sm">{option.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {option.addPrice}
                              </span>
                            </Button>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>추가 서비스</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {additionalServices.map((service) => (
                  <Button
                    key={service.id}
                    variant="outline"
                    className={`w-full justify-between h-auto py-4 ${
                      selectedAdditionalOptions.some(
                        (serviceInfo) => serviceInfo.id === service.id
                      )
                        ? "border-[#415036] bg-[#415036]/10"
                        : ""
                    }`}
                    onClick={() => {
                      const newServices = selectedAdditionalOptions.some(
                        (serviceInfo) => serviceInfo.id === service.id
                      )
                        ? selectedAdditionalOptions.filter(
                            (serviceInfo) => serviceInfo.id !== service.id
                          )
                        : [...selectedAdditionalOptions, service];
                      setSelectedAdditionalOptions(newServices);
                    }}
                  >
                    <span>{service.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {service.price}
                    </span>
                  </Button>
                ))}
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                이전
              </Button>
              <Button
                className="flex-1 bg-[#415036]"
                onClick={() => {
                  if (!selectedMainService) {
                    return;
                  }
                  updateMainServices(selectedMainService);
                  updateAdditionalService([...selectedAdditionalOptions]);
                  setCurrentStep(5);
                }}
                disabled={!selectedMainService}
              >
                다음
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>예약 정보 확인</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-600">날짜 및 시간</h3>
                  <p>
                    {formatDate(date)} {selectedTime}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-600">반려견 정보</h3>
                  <p>이름: {bookingData.petInfo.petName}</p>
                  <p>체중: {bookingData.petInfo.weight}kg</p>
                  <p>연락처: {bookingData.petInfo.phoneNumber}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-600">선택한 서비스</h3>
                  <p>
                    {getServiceNames(
                      selectedMainService ? selectedMainService.name : "",
                      selectedSubOptions.map((option) => option.name),
                      selectedAdditionalOptions.map((option) => option.name)
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-600">추가 문의사항</h3>
                  <Textarea
                    placeholder="문의사항이 있으시다면 입력해주세요"
                    className="min-h-[100px] mt-2"
                    value={inquiry}
                    onChange={(e) => setInquiry(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                이전
              </Button>
              <Button
                className="flex-1 bg-[#415036]"
                disabled={!selectedMainService}
                onClick={async () => {
                  updateInquiry(inquiry);
                  try {
                    const response = await fetch("/api/bookings", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        ...bookingData,
                        dateTime: {
                          ...bookingData.dateTime,
                          date: date?.toISOString(),
                        },
                        mainService: bookingData.mainService,
                        additionalServices: bookingData.additionalServices,
                        inquiry,
                        createdAt: new Date().toISOString(),
                      }),
                    });
                    if (!response.ok)
                      throw new Error("예약 저장에 실패했습니다.");
                    alert("예약이 완료되었습니다!");
                  } catch (error) {
                    console.error("Error saving booking:", error);
                    alert("예약 저장 중 오류가 발생했습니다.");
                  }
                }}
              >
                예약 완료
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#415036]">이리온댕댕 예약</h1>
        <div className="flex justify-between mt-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 mx-1 rounded ${
                step <= currentStep ? "bg-[#415036]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
      {renderStep()}
    </div>
  );
}
