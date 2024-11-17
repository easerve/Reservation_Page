'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useBooking } from '../context/bookingContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function IrionBooking() {
  const [currentStep, setCurrentStep] = useState(1);
  const {
    bookingData,
    updateDateTime,
    updatePetInfo,
    updateServices,
    updateInquiry,
  } = useBooking();

  // Step 1: DateTime Selection
  const [date, setDate] = useState<Date | undefined>(bookingData.dateTime.date);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    bookingData.dateTime.time
  );

  // Step 2: Pet Info Form Schema
  const formSchema = z.object({
    petName: z.string().min(1, '반려견의 이름을 입력해주세요'),
    weight: z.string().min(1, '반려견의 체중을 입력해주세요'),
    phoneNumber: z.string().min(10, '올바른 전화번호를 입력해주세요'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petName: bookingData.petInfo.petName,
      weight: bookingData.petInfo.weight,
      phoneNumber: bookingData.petInfo.phoneNumber,
    },
  });

  // Step 3: Services Selection
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Step 4: Inquiry
  const [inquiry, setInquiry] = useState(bookingData.inquiry);

  // Services data
  const services = {
    main: [
      { id: 'grooming', name: '미용', price: '50,000원' },
      { id: 'hotel', name: '호텔', price: '40,000원' },
      { id: 'pickup', name: '픽업', price: '15,000원' },
    ],
    additional: [
      { id: 'spa', name: '스파', price: '30,000원' },
      { id: 'training', name: '훈련', price: '45,000원' },
      { id: 'walking', name: '산책', price: '20,000원' },
    ],
  };

  // Add helper functions for confirmation page
  const formatDate = (date: Date | undefined) => {
    if (!date) return '날짜 미선택';
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getServiceNames = (serviceIds: string[]) => {
    const serviceMap: { [key: string]: string } = {
      grooming: '미용',
      hotel: '호텔',
      pickup: '픽업',
      spa: '스파',
      training: '훈련',
      walking: '산책',
    };
    return serviceIds.map(id => serviceMap[id] || id).join(', ');
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
                  {['09:00', '09:30', '10:00', '10:30', '11:00'].map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      className={selectedTime === time ? 'bg-[#415036]' : ''}
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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => {
                updatePetInfo(values);
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
                <Button type="submit" className="flex-1 bg-[#415036]">
                  다음
                </Button>
              </div>
            </form>
          </Form>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>메인 서비스</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {services.main.map((service) => (
                  <Button
                    key={service.id}
                    variant="outline"
                    className={`w-full justify-between h-auto py-4 ${
                      selectedServices.includes(service.id)
                        ? 'border-[#415036] bg-[#415036]/10'
                        : ''
                    }`}
                    onClick={() => {
                      const newServices = selectedServices.includes(service.id)
                        ? selectedServices.filter((id) => id !== service.id)
                        : [...selectedServices, service.id];
                      setSelectedServices(newServices);
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
            <Card>
              <CardHeader>
                <CardTitle>추가 서비스</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {services.additional.map((service) => (
                  <Button
                    key={service.id}
                    variant="outline"
                    className={`w-full justify-between h-auto py-4 ${
                      selectedServices.includes(service.id)
                        ? 'border-[#415036] bg-[#415036]/10'
                        : ''
                    }`}
                    onClick={() => {
                      const newServices = selectedServices.includes(service.id)
                        ? selectedServices.filter((id) => id !== service.id)
                        : [...selectedServices, service.id];
                      setSelectedServices(newServices);
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
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                이전
              </Button>
              <Button
                className="flex-1 bg-[#415036]"
                onClick={() => {
                  updateServices(selectedServices);
                  setCurrentStep(4);
                }}
                disabled={selectedServices.length === 0}
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
                <CardTitle>예약 정보 확인</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-600">날짜 및 시간</h3>
                  <p>{formatDate(date)} {selectedTime}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-600">반려견 정보</h3>
                  <p>이름: {bookingData.petInfo.petName}</p>
                  <p>체중: {bookingData.petInfo.weight}kg</p>
                  <p>연락처: {bookingData.petInfo.phoneNumber}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-600">선택한 서비스</h3>
                  <p>{getServiceNames(selectedServices)}</p>
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
                onClick={async () => {
                  updateInquiry(inquiry);
                  try {
                    const response = await fetch('/api/bookings', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        ...bookingData,
                        dateTime: {
                          ...bookingData.dateTime,
                          date: date?.toISOString(),
                        },
                        services: selectedServices,
                        inquiry,
                        createdAt: new Date().toISOString(),
                      }),
                    });
                    if (!response.ok) throw new Error('예약 저장에 실패했습니다.');
                    alert('예약이 완료되었습니다!');
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
        <h1 className="text-2xl font-bold text-[#415036]">이리온댕댕 예약</h1>
        <div className="flex justify-between mt-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 mx-1 rounded ${
                step <= currentStep ? 'bg-[#415036]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
      {renderStep()}
    </div>
  );
}
