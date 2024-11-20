'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  BookingData,
  Dog,
  Customer,
  UserDogsData,
  MainService,
  Option,
  AdditionalService,
} from '@/types/booking';
import {
  INITIAL_BOOKING_STATE,
  mainServices,
  additionalServices,
  bookedDates,
  breedDummyData,
} from '@/constants/booking';

export default function Booking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>(
    INITIAL_BOOKING_STATE
  );

  const resetBookingData = () => {
    setBookingData(INITIAL_BOOKING_STATE);
    setCurrentStep(1);
  };

  const updatePhoneNumber = (phoneNumber: string) => {
    setBookingData((prev) => ({
      ...prev,
      phoneNumber,
    }));
  };

  const [userDogsData, setUserDogsData] = useState<UserDogsData>({
    status: '' as string,
    customers: { dogs: [] as Dog[] } as Customer,
  });

  const updatePetInfo = (info: {
    name?: string;
    weight?: number;
    birth?: string;
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

  const updateDateTime = (date: Date, time: string | undefined) => {
    setBookingData((prev) => ({ ...prev, dateTime: { date, time } }));
  };

  const updateInquiry = (text: string) => {
    setBookingData((prev) => ({ ...prev, inquiry: text }));
  };

  const phoneNumberSchema = z.object({
    phoneNumber: z
      .string()
      .regex(
        /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/,
        '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)'
      ),
  });

  const petInfoSchema = z.object({
    name: z.string().min(1, '반려견의 이름을 입력해주세요'),
    weight: z.string().refine((val) => {
      const num = parseFloat(val);
      return (
        !isNaN(num) && num > 0 && num <= 20 && /^\d+(\.\d{0,1})?$/.test(val)
      );
    }, '0부터 20 사이의 숫자를 소수점 첫째 자리까지 입력해주세요.'),
    birth: z
      .string()
      .nonempty('반려견의 생년월일을 입력해주세요')
      .refine((val) => !isNaN(Date.parse(val)), '올바른 날짜 형식이 아닙니다.'),
    breed: z.string().min(1, '반려견의 견종을 선택해주세요'),
  });

  const phoneNumberForm = useForm<z.infer<typeof phoneNumberSchema>>({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      phoneNumber: bookingData.phoneNumber,
    },
  });

  const petInfoForm = useForm<z.infer<typeof petInfoSchema>>({
    resolver: zodResolver(petInfoSchema),
    defaultValues: {
      name: bookingData.petInfo.name,
      weight: String(bookingData.petInfo.weight),
      birth: String(bookingData.petInfo.birth),
      breed: bookingData.petInfo.breed,
    },
  });

  const [breeds, setBreeds] = useState<{ id: number; breed: string }[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<{
    id: number;
    breed: string;
  } | null>(null);

  useEffect(() => {
    const loadBreeds = async () => {
      try {
        const breedOptions = breedDummyData.breed;
        setBreeds(breedOptions);
      } catch (error) {
        console.error('Error fetching breeds:', error);
      }
    };
    loadBreeds();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceForModal, setSelectedServiceForModal] =
    useState<MainService | null>(null);
  const [selectedOptionsInModal, setSelectedOptionsInModal] = useState<
    Option[]
  >([]);

  const price = useMemo(() => {
    let totalPrice = 0;

    if (bookingData.mainService) {
      totalPrice += bookingData.mainService.price;
      bookingData.mainService.options.forEach((option) => {
        totalPrice += option.price;
      });
    }

    bookingData.additionalServices.forEach((service) => {
      totalPrice += service.price_min; // 필요에 따라 수정
    });

    return totalPrice;
  }, [bookingData]);

  const handleMainServiceSelect = (service: MainService) => {
    if (service.options && service.options.length > 0) {
      setSelectedServiceForModal(service);
      setSelectedOptionsInModal([]); // 이전 선택된 옵션 초기화
      setIsModalOpen(true);
    } else {
      setBookingData((prev) => ({
        ...prev,
        mainService: { ...service, options: [] },
      }));
    }
  };

  const handleModalOptionToggle = (option: Option) => {
    setSelectedOptionsInModal((prev) => {
      if (prev.some((opt) => opt.id === option.id)) {
        // 이미 선택된 옵션이면 제거
        return prev.filter((opt) => opt.id !== option.id);
      } else {
        // 선택되지 않은 옵션이면 추가
        return [...prev, option];
      }
    });
  };

  const confirmSelection = () => {
    if (selectedServiceForModal) {
      setBookingData((prev) => ({
        ...prev,
        mainService: {
          ...selectedServiceForModal,
          options: selectedOptionsInModal,
        },
      }));
    }
    setIsModalOpen(false);
    setSelectedServiceForModal(null);
  };

  const handleOptionSelect = (option: Option) => {
    setBookingData((prev) => {
      if (!prev.mainService) return prev;

      const updatedService = { ...prev.mainService };
      if (option.category === prev.mainService?.name) {
        updatedService.options = updatedService.options.filter(
          (o) => o.id !== option.id
        );
      } else {
        updatedService.options.push(option);
      }
      return { ...prev, mainService: updatedService };
    });
  };

  const handleAdditionalServiceToggle = (service: AdditionalService) => {
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
      names.push(
        ...bookingData.mainService.options.map((option) => option.name)
      );
    }

    if (bookingData.additionalServices.length > 0)
      names.push(bookingData.additionalServices.map((service) => service.name));

    return names.join(', ');
  };

  const allTimeSlots = ['10:00', '14:00', '17:00'];

  const fullyBookedDates = bookedDates
    .filter((booking) => booking.times.length >= allTimeSlots.length)
    .map((booking) => booking.date);

  // 선택된 날짜의 예약된 시간대 가져오기
  const getBookedTimesForDate = (date: Date | undefined): string[] => {
    const booking = bookedDates.find(
      (booking) => booking.date.toDateString() === date?.toDateString()
    );
    return booking ? booking.times : [];
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Form {...phoneNumberForm}>
            <form
              onSubmit={phoneNumberForm.handleSubmit(async (values) => {
                try {
                  const res = await fetch(
                    'http://localhost:3000/api/auth/profile?phone=' +
                      values.phoneNumber
                  );
                  const data = await res.json();
                  updatePhoneNumber(values.phoneNumber);
                  setUserDogsData(data);
                } catch (error) {
                  console.error(error);
                }
                setCurrentStep(2);
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
              <Button
                className="w-full bg-primary"
                disabled={!phoneNumberForm.formState.isValid}
              >
                다음
              </Button>
            </form>
          </Form>
        );

      case 2:
        const getFieldLabel = (field: string) => {
          if (field === 'petName') {
            return '반려견 이름';
          } else if (field === 'weight') {
            return '반려견 체중 (kg)';
          } else if (field === 'age') {
            return '반려견 나이';
          } else if (field === 'breed') {
            return '반려견 견종';
          }
          return '';
        };

        return (
          <Form {...petInfoForm}>
            <form
              onSubmit={petInfoForm.handleSubmit((values) => {
                updatePetInfo({
                  name: values.name,
                  weight: Number(values.weight),
                  birth: values.birth,
                  breed: selectedBreed ? selectedBreed.breed : '',
                });
                setCurrentStep(3);
              })}
            >
              {userDogsData.status === 'success' ? (
                <div className="space-y-6">
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
                            bookingData.petInfo.name === dog.name
                              ? 'border-primary] bg-primary/10'
                              : ''
                          }`}
                          onClick={() => {
                            updatePetInfo({
                              name: dog.name,
                              weight: dog.weight,
                              birth: dog.birth,
                              breed: dog.breed,
                            });
                          }}
                        >
                          <div>
                            <p>이름: {dog.name}</p>
                            <p>견종: {dog.breed}</p>
                            <p>
                              나이:{' '}
                              {(() => {
                                const birthDate = new Date(dog.birth);
                                const today = new Date();
                                const months =
                                  (today.getFullYear() -
                                    birthDate.getFullYear()) *
                                    12 +
                                  (today.getMonth() - birthDate.getMonth());
                                return Math.floor(months / 12);
                              })()}
                              개월
                            </p>
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
                      onClick={() => setCurrentStep(1)}
                    >
                      이전
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 bg-primary"
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
                      {['petName', 'weight', 'age'].map((field) => (
                        <FormField
                          key={field}
                          control={petInfoForm.control}
                          name={field as any}
                          render={({ field: fieldProps }) => (
                            <FormItem>
                              <FormLabel>{getFieldLabel(field)}</FormLabel>
                              <FormControl>
                                <Input
                                  type={field === 'petName' ? 'text' : 'number'}
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
                                        ) ?? null
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
                      onClick={() => setCurrentStep(1)}
                    >
                      이전
                    </Button>
                    <Button type="submit" className="flex-1 bg-primary">
                      다음
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>날짜 및 시간 선택</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={bookingData.dateTime.date}
                  onSelect={(date) => {
                    if (date) {
                      updateDateTime(date, undefined);
                    }
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return (
                      date < today ||
                      fullyBookedDates.some(
                        (bookedDate) =>
                          bookedDate.toDateString() === date.toDateString()
                      )
                    );
                  }}
                />
                {bookingData.dateTime.date && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {allTimeSlots.map((time) => {
                      const today = new Date();
                      const selectedDate = new Date(bookingData.dateTime.date);

                      const [hours, minutes] = time.split(':').map(Number);
                      selectedDate.setHours(hours, minutes, 0, 0);

                      const isDisabled =
                        selectedDate < today ||
                        getBookedTimesForDate(
                          bookingData.dateTime.date
                        ).includes(time);

                      return (
                        <Button
                          key={time}
                          variant={
                            bookingData.dateTime.time === time
                              ? 'default'
                              : 'outline'
                          }
                          className={
                            bookingData.dateTime.time === time
                              ? 'bg-primary'
                              : ''
                          }
                          disabled={isDisabled}
                          onClick={() =>
                            updateDateTime(bookingData.dateTime.date, time)
                          }
                        >
                          {time}
                        </Button>
                      );
                    })}
                  </div>
                )}
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
                type="submit"
                className="flex-1 bg-primary"
                disabled={
                  !bookingData.dateTime.date || !bookingData.dateTime.time
                }
                onClick={() => setCurrentStep(4)}
              >
                다음
              </Button>
            </div>
          </div>
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
                        bookingData.mainService?.id === service.id
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
                  </div>
                ))}
              </CardContent>
              {selectedServiceForModal && (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {selectedServiceForModal.name} 옵션 선택
                      </DialogTitle>
                      <DialogDescription>
                        원하시는 옵션을 선택해주세요.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                      {selectedServiceForModal.options.map((option) => (
                        <Button
                          key={option.id}
                          variant={
                            selectedOptionsInModal.some(
                              (opt) => opt.id === option.id
                            )
                              ? 'default'
                              : 'outline'
                          }
                          onClick={() => handleModalOptionToggle(option)}
                          className="w-full justify-between"
                        >
                          <span>{option.name}</span>
                          <span>+ {option.price.toLocaleString()}원</span>
                        </Button>
                      ))}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
                      >
                        취소
                      </Button>
                      <Button onClick={confirmSelection}>선택 완료</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
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
                      {service.price_min == 0
                        ? ''
                        : `+ ${service.price_min.toLocaleString()}원`}
                    </span>
                  </Button>
                ))}
              </CardContent>
            </Card>

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
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                이전
              </Button>
              <Button
                className="flex-1 bg-primary"
                onClick={() => {
                  if (!bookingData.mainService) {
                    return;
                  }
                  setCurrentStep(5);
                }}
                disabled={!bookingData.mainService}
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
                    {formatDate(bookingData.dateTime.date)}{' '}
                    {bookingData.dateTime.time}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-600">반려견 정보</h3>
                  <p>이름: {bookingData.petInfo.name}</p>
                  <p>체중: {bookingData.petInfo.weight}kg</p>
                  <p>연락처: {bookingData.phoneNumber}</p>
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
                    value={bookingData.inquiry}
                    onChange={(e) => updateInquiry(e.target.value)}
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
          {[1, 2, 3, 4, 5].map((step) => (
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
