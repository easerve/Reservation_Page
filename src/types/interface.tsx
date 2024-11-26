export interface IDefaultDialog {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export interface AdminReservationInfo {
  uuid: string;
  reservation_date: string;
  memo: string;
  status: string;
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
      address: string;
      detail_address: string;
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

export interface IAppSidebar {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
