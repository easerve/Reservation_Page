'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useBooking } from '../context/bookingContext';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  petName: z.string().min(1, '반려견의 이름을 입력해주세요'),
  weight: z.string().min(1, '반려견의 체중을 입력해주세요'),
  phoneNumber: z.string().min(10, '올바른 전화번호를 입력해주세요'),
});

export default function Component() {
  const { bookingData, updatePetInfo } = useBooking();
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petName: bookingData.petInfo.petName,
      weight: bookingData.petInfo.weight,
      phoneNumber: bookingData.petInfo.phoneNumber,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updatePetInfo(values);
    router.push('/service-selection');
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link href="/date-time-selection">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">반려견 정보</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">반려견 및 보호자 정보 입력</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="petName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>반려견 이름</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="반려견의 이름을 입력해주세요"
                        {...field}
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
                    <FormLabel>반려견 체중 (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="반려견의 체중을 입력해주세요"
                        {...field}
                      />
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
                    <FormLabel>보호자 전화번호</FormLabel>
                    <FormControl>
                      <Input placeholder="전화번호를 입력해주세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600"
              >
                다음
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
