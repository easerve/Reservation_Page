'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useBooking } from '../context/bookingContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Component() {
  const { bookingData } = useBooking();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleConfirmBooking = async () => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          dateTime: {
            ...bookingData.dateTime,
            date: bookingData.dateTime.date?.toISOString(),
          },
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('예약 저장에 실패했습니다.');
      }

      alert('예약이 완료되었습니다!');
      router.push('/');
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('예약 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link href="/inquiry">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">예약 확인</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">예약 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-600">날짜 및 시간</h3>
            <p>{formatDate(bookingData.dateTime.date)} {bookingData.dateTime.time}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-600">반려견 정보</h3>
            <p>이름: {bookingData.petInfo.petName}</p>
            <p>체중: {bookingData.petInfo.weight}kg</p>
            <p>연락처: {bookingData.petInfo.phoneNumber}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-600">선택한 서비스</h3>
            <p>{getServiceNames(bookingData.services)}</p>
          </div>

          {bookingData.inquiry && (
            <div>
              <h3 className="font-medium text-gray-600">문의사항</h3>
              <p className="whitespace-pre-wrap">{bookingData.inquiry}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Button 
        className="w-full bg-green-500 hover:bg-green-600"
        onClick={handleConfirmBooking}
        disabled={isSubmitting}
      >
        {isSubmitting ? '저장 중...' : '예약 완료'}
      </Button>
    </div>
  );
}
