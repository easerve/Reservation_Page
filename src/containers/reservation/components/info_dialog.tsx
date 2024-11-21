import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAge2 } from "@/components/utils/date_utils";
import { Reservation } from "@/types/interface";
import {
  CalendarIcon,
  ClockIcon,
  DogIcon,
  PhoneIcon,
  ScissorsIcon,
} from "lucide-react";

export default function InfoDialog(props: {
  reservation: Reservation;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  if (!props.reservation) {
    return null;
  }

  const handleClickEditBtn = () => {
    props.onOpenChange(false);
    props.setIsEditDialogOpen(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>미용 예약 정보</DialogTitle>
          <DialogDescription>
            {props.reservation.name}의 미용 예약 상세 정보입니다.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className=" pr-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {props.reservation.name}
              </CardTitle>
              <CardDescription>
                {props.reservation.breed} • {props.reservation.weight}kg
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 opacity-70" />
                <span className="text-sm font-medium">
                  {formatDate(props.reservation.time)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4 opacity-70" />
                <span className="text-sm font-medium">
                  {formatTime(props.reservation.time)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <DogIcon className="h-4 w-4 opacity-70" />
                <span className="text-sm font-medium">
                  {`${getAge2(props.reservation.birth).years}년 ${
                    getAge2(props.reservation.birth).months
                  }개월`}{" "}
                  (생일: {props.reservation.birth})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4 opacity-70" />
                <span className="text-sm font-medium">
                  {props.reservation.phone}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <ScissorsIcon className="h-4 w-4 opacity-70" />
                <span className="text-sm font-medium">
                  {props.reservation.service_name}
                </span>
              </div>
              {props.reservation.additional_services && (
                <div className="text-sm font-medium">
                  추가 서비스: {props.reservation.additional_services}
                </div>
              )}
              <div className="text-sm font-medium">
                상태:{" "}
                <span className="text-green-600">
                  {props.reservation.status}
                </span>
              </div>
              <div className="text-sm font-medium">
                가격: {props.reservation.price.toLocaleString()}원
              </div>
              {props.reservation.additional_price > 0 && (
                <div className="text-sm font-medium">
                  추가 요금:{" "}
                  {props.reservation.additional_price.toLocaleString()}원
                </div>
              )}
              <div className="text-sm font-medium">
                총 금액:{" "}
                {(
                  props.reservation.price + props.reservation.additional_price
                ).toLocaleString()}
                원
              </div>
              {props.reservation.memo && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">특이사항</h4>
                  <p className="text-sm text-gray-600">
                    {props.reservation.memo}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </ScrollArea>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClickEditBtn}
          >
            예약 수정
          </Button>
          <Button type="button" onClick={() => props.onOpenChange(false)}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
