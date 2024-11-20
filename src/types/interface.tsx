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
  birth: string,
  phone: string; // 11자리 숫자
  service_name: Array<string>; // Ex. ["스포팅", "발톱 깎기"]
  additional_service: string; // 추가 서비스
  memo: string; // 특이사항 Ex. "털엉킴, 사나움"
  status: string;
  price: number; // 기본 가격
  additional_price: number; // 추가 가격
}