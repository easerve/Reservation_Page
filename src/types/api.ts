interface UserInfo {
  name: string;
  phone: string;
  address: string;
  detail_address: string;
}

interface PetInfo {
  name: string | null;
  birth: string | null;
  weight: number | null;
  user: UserInfo;
  breeds: {
    name: string;
  };
  memo: string | null;
  neutering: boolean | null;
  sex: string | null;
  reg_number: string | null;
}

export interface ReservationDBInfo {
  uuid: string;
  reservation_date: string;
  memo: string | null;
  status: string;
  additional_services: string | null;
  additional_price: number | null;
  total_price: number;
  service_name: string;
  pet_id: string;
  pets: PetInfo;
}

export interface ReservationInfo {
  id: string;
  time: Date;
  memo: string | null;
  services: string;
  price: number;
  additional_services: string | null;
  additional_price: number | null;
  status: string;
  pet_id: string;
  pets: PetInfo;
}
