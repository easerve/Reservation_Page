
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useBooking } from '../context/bookingContext';
import { useRouter } from 'next/navigation';

export default function Component() {
  const { bookingData, updateInquiry } = useBooking();
  const router = useRouter();
  const [inquiry, setInquiry] = useState(bookingData.inquiry);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateInquiry(inquiry);
    // Here you would typically submit all booking data
    console.log('Final booking data:', bookingData);
    router.push('/confirmation'); // Or wherever you want to redirect after submission
  };

  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link href="/service-selection">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">문의사항</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">추가 문의사항</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="문의사항이 있으시다면 입력해주세요"
              className="min-h-[200px]"
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
            />
            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600"
            >
              예약하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
