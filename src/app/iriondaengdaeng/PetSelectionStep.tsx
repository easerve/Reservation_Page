import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CutAgreementPage from "@/app/iriondaengdaeng/cutAgreementPage";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BookingData, UserDogsData, Dog } from "@/types/booking";

import { zodResolver } from "@hookform/resolvers/zod";

interface PetSelectionStepProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  bookingData: BookingData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
  userDogsData: UserDogsData;
  breeds: { id: number; name: string; type: number }[];
  setIsPuppyAdd: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PetSelectionStep({
  setCurrentStep,
  bookingData,
  setBookingData,
  userDogsData,
  breeds,
  setIsPuppyAdd,
}: PetSelectionStepProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const updatePetInfo = (info: Dog) => {
    setBookingData((prev) => ({
      ...prev,
      dog: {
        ...prev.dog,
        ...info,
      },
    }));
  };
  const petInfoSchema = z.object({
    name: z.string().min(1, "반려견의 이름을 입력해주세요"),
    weight: z.string().refine((val) => {
      const num = parseFloat(val);
      return (
        !isNaN(num) && num > 0 && num <= 30 && /^\d+(\.\d{0,1})?$/.test(val)
      );
    }, "0부터 30 사이의 숫자를 소수점 첫째 자리까지 입력해주세요."),
    birth: z
      .string()
      .nonempty("반려견의 생년월일을 입력해주세요")
      .refine((val) => !isNaN(Date.parse(val)), "올바른 날짜 형식이 아닙니다."),
    breed: z.string().min(1, "반려견의 견종을 선택해주세요"),
  });
  const petInfoForm = useForm<z.infer<typeof petInfoSchema>>({
    resolver: zodResolver(petInfoSchema),
    defaultValues: {
      name: bookingData.dog.petName,
      weight: String(bookingData.dog.weight),
      birth: String(bookingData.dog.birth),
      breed: bookingData.dog.breed.toString(),
    },
  });
  return (
    <Form {...petInfoForm}>
      <form
        onSubmit={petInfoForm.handleSubmit(() => {
          setCurrentStep(3);
        })}
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>반려견 선택</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userDogsData.customers.dogs.map((dog, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className={`w-full justify-between h-auto py-4 ${
                    bookingData.dog.petName === dog.petName
                      ? "border-primary bg-primary/10"
                      : ""
                  }`}
                  onClick={() => {
                    updatePetInfo({ ...dog });
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
                          (today.getFullYear() - birthDate.getFullYear()) * 12 +
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
              <Button
                variant="outline"
                className={`w-full justify-between h-auto py-4`}
                onClick={openModal}
              >
                <div>강아지 추가하기</div>
              </Button>
              <CutAgreementPage
                isOpen={isModalOpen}
                onClose={closeModal}
                breeds={breeds}
                setIsPuppyAdd={setIsPuppyAdd}
                userUUID={userDogsData.customers.id}
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
            <Button
              onClick={() => setCurrentStep(3)}
              className="flex-1 bg-primary"
            >
              다음
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
