import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingData, UserDogsData } from "@/types/booking";
import { INITIAL_BOOKING_STATE } from "@/constants/booking";

interface ConfirmationStepProps {
  bookingData: BookingData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  userDogsData: UserDogsData;
}

export default function ConfirmationStep({
  bookingData,
  setBookingData,
  setCurrentStep,
  userDogsData,
}: ConfirmationStepProps) {
  const resetBookingData = () => {
    setBookingData(INITIAL_BOOKING_STATE);
    setCurrentStep(1);
  };
  async function reservations() {
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ReservationInfo: {
            pet_id: bookingData.dog.id,
            reservation_date: `${
              bookingData.dateTime.date.toISOString().split("T")[0]
            } ${bookingData.dateTime.time}:00+09`,
            memo: bookingData.inquiry,
            status: userDogsData.status === "new" ? "예약대기" : "예약확정",
            consent_form: true,
            service_name:
              `${bookingData.mainService?.name}(` +
              [bookingData.mainService?.options.map((option) => option.name), ,]
                .flat()
                .join(", ") +
              ")",
            additional_services: bookingData.additionalServices
              .map((service) => service.service_name)
              .join(", "),
            total_price: bookingData.price[0],
            additional_price: bookingData.price[1] - bookingData.price[0],
          },
        }),
      });
      if (!response.ok) {
        throw new Error("예약 저장에 실패했습니다.");
      }
      alert("예약이 완료되었습니다.");
      resetBookingData();
    } catch (error) {
      console.error("Error saving reservation:", error);
      alert("예약 저장 중 오류가 발생했습니다.");
      resetBookingData();
    }
  }
  const updateInquiry = (text: string) => {
    setBookingData((prev) => ({ ...prev, inquiry: text }));
  };
  const formatDate = (date: Date | undefined) => {
    if (!date) return "날짜 미선택";
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getServiceNames = () => {
    const names = [];

    if (bookingData.mainService) {
      names.push(bookingData.mainService.name);
      names.push(
        ...bookingData.mainService.options.map((option) => option.name)
      );
    }

    if (bookingData.additionalServices.length > 0)
      names.push(
        ...bookingData.additionalServices.map((service) => service.service_name)
      );

    return names.join(", ");
  };
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
              {formatDate(bookingData.dateTime.date)}{" "}
              {bookingData.dateTime.time}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-600">반려견 정보</h3>
            <p>이름: {bookingData.dog.petName}</p>
            <p>체중: {bookingData.dog.weight}kg</p>
            <p>연락처: {bookingData.phoneNumber}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-600">선택한 서비스</h3>
            <p>{getServiceNames()}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-600">결제 금액</h3>
            <p>
              {bookingData.price[0] === bookingData.price[1]
                ? `${bookingData.price[0]}원`
                : `${bookingData.price[0]}~${bookingData.price[1]}원`}
            </p>
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
        <Button variant="outline" onClick={() => setCurrentStep(4)}>
          이전
        </Button>
        <Button className="flex-1 bg-primary" onClick={reservations}>
          예약 완료
        </Button>
      </div>
    </div>
  );
}
