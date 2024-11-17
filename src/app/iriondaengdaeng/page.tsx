'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  
  // Move booking state from context to component
  const [bookingData, setBookingData] = useState({
    dateTime: { date: undefined as Date | undefined, time: undefined as string | undefined },
    petInfo: { petName: '', weight: '', phoneNumber: '' },
    services: [] as string[],
    inquiry: '',
  });

  // Create state update functions
  const updateDateTime = (date: Date | undefined, time: string | undefined) => {
    setBookingData(prev => ({ ...prev, dateTime: { date, time } }));
  };

  const updatePetInfo = (info: { petName: string; weight: string; phoneNumber: string }) => {
    setBookingData(prev => ({ ...prev, petInfo: info }));
  };

  const updateServices = (services: string[]) => {
    setBookingData(prev => ({ ...prev, services }));
  };

  const updateInquiry = (text: string) => {
    setBookingData(prev => ({ ...prev, inquiry: text }));
  };

  // Replace existing state declarations with values from bookingData
  const [date, setDate] = useState<Date | undefined>(bookingData.dateTime.date);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(bookingData.dateTime.time);

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
  const [selectedMainServices, setSelectedMainServices] = useState<string[]>([]);
  const [selectedSubOptions, setSelectedSubOptions] = useState<string[]>([]);

  // Step 4: Inquiry
  const [inquiry, setInquiry] = useState(bookingData.inquiry);

  // Services data
    const services = {
    main: [
      {
        id: 'grooming',
        name: '위생미용+목욕',
        price: '25,000원',
        subOptions: [
          { id: 'shampoo', name: '샴푸 업그레이드', price: '+ 10,000원' },
          { id: 'perfume', name: '향수 추가', price: '+ 5,000원' },
        ],
      },
      {
        id: 'clipping',
        name: '클리핑',
        price: '25,000원',
        subOptions: [
          { id: 'nailTrim', name: '발톱 정리', price: '+ 5,000원' },
          { id: 'earCleaning', name: '귀 청소', price: '+ 8,000원' },
        ],
      },
      {
        id: 'sporting',
        name: '스포팅',
        price: '15,000원',
        subOptions: [],
      },
      {
        id: 'scissorCut',
        name: '가위컷',
        price: '15,000원',
        subOptions: [],
      },
    ],
    additional: [
      { id: 'instep', name: '발등', price: '5,000원' },
      { id: 'tangle', name: '엉킴', price: '10,000원' },
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

  const getServiceNames = (mainServices: string[], subOptions: string[]) => {
    const allServices = [...mainServices, ...subOptions];
    const serviceMap: { [key: string]: string } = {
      grooming: '위생미용+목욕',
      clipping: '클리핑',
      sporting: '스포팅',
      scissorCut: '가위컷',
      instep: '발등',
      tangle: '엉킴',
      shampoo: '샴푸 업그레이드',
      perfume: '향수 추가',
      nailTrim: '발톱 정리',
      earCleaning: '귀 청소',
    };
    return allServices.map(id => serviceMap[id] || id).join(', ');
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
                  <div key={service.id} className="space-y-2">
                    <Button
                      variant="outline"
                      className={`w-full justify-between h-auto py-4 ${
                        selectedMainServices.includes(service.id)
                          ? 'border-[#415036] bg-[#415036]/10'
                          : ''
                      }`}
                      onClick={() => {
                        const newServices = selectedMainServices.includes(service.id)
                          ? selectedMainServices.filter((id) => id !== service.id)
                          : [...selectedMainServices, service.id];
                        setSelectedMainServices(newServices);
                        // Clear subOptions of this service when deselecting
                        if (!newServices.includes(service.id)) {
                          setSelectedSubOptions(prev => 
                            prev.filter(opt => !service.subOptions.some(sub => sub.id === opt))
                          );
                        }
                      }}
                    >
                      <span>{service.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {service.price}
                      </span>
                    </Button>
                    
                    {selectedMainServices.includes(service.id) && service.subOptions.length > 0 && (
                      <div className="ml-4 space-y-2">
                        {service.subOptions.map((subOption) => (
                          <Button
                            key={subOption.id}
                            variant="outline"
                            className={`w-full justify-between h-auto py-3 ${
                              selectedSubOptions.includes(subOption.id)
                                ? 'border-[#415036] bg-[#415036]/10'
                                : ''
                            }`}
                            onClick={() => {
                              const newSubOptions = selectedSubOptions.includes(subOption.id)
                                ? selectedSubOptions.filter((id) => id !== subOption.id)
                                : [...selectedSubOptions, subOption.id];
                              setSelectedSubOptions(newSubOptions);
                            }}
                          >
                            <span className="text-sm">{subOption.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {subOption.price}
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
                {services.additional.map((service) => (
                  <Button
                    key={service.id}
                    variant="outline"
                    className={`w-full justify-between h-auto py-4 ${
                      selectedMainServices.includes(service.id)
                        ? 'border-[#415036] bg-[#415036]/10'
                        : ''
                    }`}
                    onClick={() => {
                      const newServices = selectedMainServices.includes(service.id)
                        ? selectedMainServices.filter((id) => id !== service.id)
                        : [...selectedMainServices, service.id];
                      setSelectedMainServices(newServices);
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
                  updateServices([...selectedMainServices, ...selectedSubOptions]);
                  setCurrentStep(4);
                }}
                disabled={selectedMainServices.length === 0}
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
                  <h3 className="font-medium text-gray-600">��택한 서비스</h3>
                  <p>{getServiceNames(selectedMainServices, selectedSubOptions)}</p>
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
                        services: [...selectedMainServices, ...selectedSubOptions],
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
