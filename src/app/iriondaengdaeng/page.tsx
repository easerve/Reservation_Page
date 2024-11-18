'use client';

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookingData, BookingService, OptionInfo } from '@/types/booking';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { mainServices, additionalServices } from '@/constants/booking';
import { INITIAL_BOOKING_STATE } from '@/constants/booking';

export default function Booking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>(
    INITIAL_BOOKING_STATE
  );

  const resetBookingData = () => {
    setBookingData(INITIAL_BOOKING_STATE);
    setCurrentStep(1);
  };

  const updateDateTime = (date: Date | undefined, time: string | undefined) => {
    setBookingData((prev) => ({ ...prev, dateTime: { date, time } }));
  };

  const updatePetInfo = (info: {
    petName: string;
    weight: number | undefined;
    phoneNumber: string;
  }) => {
    setBookingData((prev) => ({ ...prev, petInfo: info }));
  };

  const updateInquiry = (text: string) => {
    setBookingData((prev) => ({ ...prev, inquiry: text }));
  };

  const formSchema = z.object({
    petName: z.string().min(1, '반려견의 이름을 입력해주세요.'),
    weight: z.string().refine((val) => {
      const num = parseFloat(val);
      return (
        !isNaN(num) && num > 0 && num <= 20 && /^\d+(\.\d{0,1})?$/.test(val)
      );
    }, '0부터 20 사이의 숫자를 소수점 첫째 자리까지 입력해주세요.'),
    phoneNumber: z
      .string()
      .regex(
        /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
        '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)'
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petName: bookingData.petInfo.petName,
      weight: String(bookingData.petInfo.weight || ''),
      phoneNumber: bookingData.petInfo.phoneNumber,
    },
  });

  // 날짜 및 시간 선택을 위한 상태
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    bookingData.dateTime.date
  );
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    bookingData.dateTime.time
  );

  // 가격 계산
  const price = useMemo(() => {
    let totalPrice = 0;

    if (bookingData.mainService) {
      totalPrice += bookingData.mainService.price;

      bookingData.mainService.options.forEach((option) => {
        totalPrice += option.addPrice;
      });
    }

    bookingData.additionalServices.forEach((service) => {
      totalPrice += service.price;
    });

    return totalPrice;
  }, [bookingData]);

  // 문의사항 상태
  const [inquiry, setInquiry] = useState(bookingData.inquiry);

  // 서비스 선택 핸들러
  const handleMainServiceSelect = (service: BookingService) => {
    setBookingData((prev) => ({
      ...prev,
      mainService: { ...service, options: [] },
    }));
  };

  const handleSubOptionToggle = (option: OptionInfo) => {
    if (!bookingData.mainService) return;

    setBookingData((prev) => {
      const isSelected = prev.mainService?.options.some(
        (opt) => opt.id === option.id
      );
      return {
        ...prev,
        mainService: {
          ...prev.mainService!,
          options: isSelected
            ? prev.mainService!.options.filter((opt) => opt.id !== option.id)
            : [...prev.mainService!.options, option],
        },
      };
    });
  };

  const handleAdditionalServiceToggle = (service: BookingService) => {
    setBookingData((prev) => {
      const isSelected = prev.additionalServices.some(
        (s) => s.id === service.id
      );
      const newAdditionalServices = isSelected
        ? prev.additionalServices.filter((s) => s.id !== service.id)
        : [...prev.additionalServices, service];
      return { ...prev, additionalServices: newAdditionalServices };
    });
  };

  // 날짜 포맷팅
  const formatDate = (date: Date | undefined) => {
    if (!date) return '날짜 미선택';
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 선택된 서비스 이름 가져오기
  const getServiceNames = () => {
    const names = [];

    if (bookingData.mainService) {
      names.push(bookingData.mainService.name);
    }

    if (bookingData.mainService)
      names.push(
        ...bookingData.mainService.options.map((option) => option.name)
      );
    names.push(
      ...bookingData.additionalServices.map((service) => service.name)
    );

    return names.join(', ');
  };

  const renderStep = () => {
    switch (currentStep) {
      // Step 1: 날짜 및 시간 선택
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
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {['10:00', '14:00', '17:00'].map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      className={selectedTime === time ? 'bg-primary' : ''}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Button
              className="w-full bg-primary"
              onClick={() => {
                updateDateTime(selectedDate, selectedTime);
                setCurrentStep(2);
              }}
              disabled={!selectedDate || !selectedTime}
            >
              다음
            </Button>
          </div>
        );

      // Step 2: 반려견 정보 입력
      case 2:
        return (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => {
                updatePetInfo({
                  petName: values.petName,
                  weight: parseFloat(values.weight),
                  phoneNumber: values.phoneNumber,
                });
                setCurrentStep(3);
              })}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>반려견 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['petName', 'weight', 'phoneNumber'].map((field) => (
                    <FormField
                      key={field}
                      control={form.control}
                      name={field as any}
                      render={({ field: fieldProps }) => (
                        <FormItem>
                          <FormLabel>
                            {field === 'petName'
                              ? '반려견 이름'
                              : field === 'weight'
                              ? '반려견 체중 (kg)'
                              : '보호자 전화번호'}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type={field === 'weight' ? 'number' : 'text'}
                              {...fieldProps}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
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
                <Button type="submit" className="flex-1 bg-primary">
                  다음
                </Button>
              </div>
            </form>
          </Form>
        );

      // Step 3: 서비스 선택
      case 3:
        return (
          <div className="space-y-6">
            {/* 메인 서비스 */}
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
                        bookingData.mainService &&
                        bookingData.mainService.id === service.id
                          ? 'border-primary bg-primary/10'
                          : ''
                      }`}
                      onClick={() => handleMainServiceSelect(service)}
                    >
                      <span>{service.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {service.price.toLocaleString()}원
                      </span>
                    </Button>

                    {bookingData.mainService &&
                      bookingData.mainService.id === service.id &&
                      service.options.length > 0 && (
                        <div className="ml-4 space-y-2">
                          {service.options.map((option) => (
                            <Button
                              key={option.id}
                              variant="outline"
                              className={`w-full justify-between h-auto py-3 ${
                                bookingData.mainService?.options.some(
                                  (opt) => opt.id === option.id
                                )
                                  ? 'border-primary bg-primary/10'
                                  : ''
                              }`}
                              onClick={() => handleSubOptionToggle(option)}
                            >
                              <span className="text-sm">{option.name}</span>
                              <span className="text-sm text-muted-foreground">
                                + {option.addPrice.toLocaleString()}원
                              </span>
                            </Button>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 추가 서비스 */}
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
                      bookingData.additionalServices.some(
                        (s) => s.id === service.id
                      )
                        ? 'border-primary bg-primary/10'
                        : ''
                    }`}
                    onClick={() => handleAdditionalServiceToggle(service)}
                  >
                    <span>{service.name}</span>
                    <span className="text-sm text-muted-foreground">
                      + {service.price.toLocaleString()}원
                    </span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* 가격 표시 */}
            <Card>
              <CardHeader>
                <CardTitle>결제 금액</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary text-right">
                  {price.toLocaleString()}원
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                이전
              </Button>
              <Button
                className="flex-1 bg-primary"
                onClick={() => {
                  if (!bookingData.mainService) {
                    return;
                  }
                  setCurrentStep(4);
                }}
                disabled={!bookingData.mainService}
              >
                다음
              </Button>
            </div>
          </div>
        );

      // Step 4: 예약 정보 확인
      case 4:
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
                    {formatDate(bookingData.dateTime.date)}{' '}
                    {bookingData.dateTime.time}
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
                  <p>{getServiceNames()}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-600">결제 금액</h3>
                  <p>{price.toLocaleString()}원</p>
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
                className="flex-1 bg-primary"
                onClick={async () => {
                  updateInquiry(inquiry);
                  try {
                    const response = await fetch('/api/bookings', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        ...bookingData,
                        price,
                      }),
                    });
                    if (!response.ok) {
                      throw new Error('예약 저장에 실패했습니다.');
                    }
                    alert('예약이 완료되었습니다.');
                    resetBookingData();
                  } catch (error) {
                    console.error('Error saving booking:', error);
                    alert('예약 저장 중 오류가 발생했습니다.');
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
        <h1 className="text-2xl font-bold text-primary">이리온댕댕 예약</h1>
        <div className="flex justify-between mt-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 mx-1 rounded ${
                step <= currentStep ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
      {renderStep()}
    </div>
  );
}
