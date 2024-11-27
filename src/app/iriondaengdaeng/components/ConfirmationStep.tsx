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
              [
                bookingData.mainService.optionCategories.map((category) =>
                  category.options.map((option) => option.option_name),
                ),
              ]
                .flat()
                .join(", ") +
              ")",
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

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200 shadow-md">
        <CardHeader className="bg-gray-100 p-4 rounded-t-lg">
          <CardTitle className="text-xl font-bold text-gray-800">
            예약 정보 확인
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="border-b pb-4">
            <h3 className="font-medium text-lg text-gray-900">날짜 및 시간</h3>
            <p className="text-gray-700 mt-2">
              {formatDate(bookingData.dateTime.date)}{" "}
              {bookingData.dateTime.time}
            </p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-medium text-lg text-gray-900">반려견 정보</h3>
            <p className="text-gray-700 mt-2">
              이름: {bookingData.dog.petName}
            </p>
            <p className="text-gray-700">체중: {bookingData.dog.weight}kg</p>
            <p className="text-gray-700">연락처: {bookingData.phoneNumber}</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-medium text-lg text-gray-900">선택한 서비스</h3>
            <p className="text-primary font-medium mt-2">
              {bookingData.mainService?.name}
            </p>
            <p className="text-gray-500 text-sm">
              {bookingData.mainService.optionCategories
                .map((category) =>
                  category.options.map((option) => option.option_name),
                )
                .join(", ")}
            </p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-medium text-lg text-gray-900">예상 금액</h3>
            <p className="text-gray-700 mt-2">
              {bookingData.price[1] === 0
                ? `${bookingData.price[0].toLocaleString()}원`
                : `${bookingData.price[0].toLocaleString()}~${(bookingData.price[0] + bookingData.price[1]).toLocaleString()}원`}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg text-gray-900">추가 문의사항</h3>
            <Textarea
              placeholder="문의사항이 있으시다면 입력해주세요"
              className="min-h-[120px] mt-2 border-gray-300 focus:border-primary focus:ring-primary"
              value={bookingData.inquiry}
              onChange={(e) => updateInquiry(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          variant="outline"
          className="px-6 py-3 border-gray-300 text-gray-700"
          onClick={() => setCurrentStep(4)}
        >
          이전
        </Button>
        <Button
          className="flex-1 px-6 py-3 bg-primary text-white hover:bg-primary-dark transition-all"
          onClick={reservations}
        >
          예약 완료
        </Button>
      </div>
    </div>
  );
}
