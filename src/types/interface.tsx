export interface IDefaultDialog {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export interface Reservation {
  id: string; // uuid
  time: Date; // Date
  breed: string;
  name: string;
  weight: number;
  birth: string;
  phone: string; // 11자리 숫자
  service_name: string; // Ex. ["스포팅", "발톱 깎기"]
  additional_services: string; // 추가 서비스
  additional_price: number; // 추가 가격
  price: number; // 기본 가격
  status: string;
  consent_form: boolean; // 동의서
  memo: string; // 특이사항 Ex. "털엉킴, 사나움"
}

export interface AdminReservationInfo {
  uuid: string;
  reservation_date: string;
  memo: string;
  status: string;
  consent_form: boolean;
  additional_services: string;
  additional_price: number;
  total_price: number;
  service_name: string;
  pet_id: {
    name: string;
    birth: string;
    weight: number;
    user_id: {
      name: string;
      phone: string;
    };
    breed_id: {
      name: string;
    };
    memo: string;
    neutering: boolean;
  };
}

export const ReservationStatus = [
  {
    label: "waiting",
    value: "예약대기",
    css: "bg-yellow-200",
  },
  {
    label: "confirmed",
    value: "예약확정",
    css: "bg-green-200",
  },
  {
    label: "cancelled",
    value: "예약취소",
    css: "bg-red-200",
  },
  {
    label: "completed",
    value: "미용완료",
    css: "bg-blue-200",
  },
];
