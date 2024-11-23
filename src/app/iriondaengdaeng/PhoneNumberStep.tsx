import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingData } from "@/types/booking";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .regex(
      /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/,
      "대시('-')를 제외한 휴대폰 번호를 입력해주세요"
    ),
});

interface PhoneNumberStepProps {
  bookingData: BookingData;
  setCurrentStep: (step: number) => void;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
  getUserData: (values: { phoneNumber: string }) => Promise<void>;
}

export default function PhoneNumberStep({
  bookingData,
  setCurrentStep,
  setBookingData,
  getUserData,
}: PhoneNumberStepProps) {
  const phoneNumberForm = useForm<z.infer<typeof phoneNumberSchema>>({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      phoneNumber: bookingData.phoneNumber,
    },
  });
  const updatePhoneNumber = (phoneNumber: string) => {
    setBookingData((prev) => ({
      ...prev,
      phoneNumber,
    }));
  };
  return (
    <Form {...phoneNumberForm}>
      <form
        onSubmit={phoneNumberForm.handleSubmit(
          async (values: { phoneNumber: string }) => {
            updatePhoneNumber(values.phoneNumber);
            await getUserData(values);
            setCurrentStep(2);
          }
        )}
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
}
