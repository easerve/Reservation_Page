export interface BookingData {
  phoneNumber: string;
  dog: Dog;
  dateTime: BookingDateTime;
  mainService?: MainService;
  inquiry: string;
  price: number[];
}

export interface BookingDateTime {
  date: Date;
  time?: string;
}

export interface Breed {
  id: number;
  name: string;
  type: number;
  line_cut: boolean;
}

export interface Option {
  category_id: number;
  option_id: number;
  option_name: string;
  option_price: number;
}

export interface OptionCategory {
  category_id: number;
  category_name: string;
  options: Option[];
}

export interface MainService {
  service_id: number;
  service_name_id: number;
  name: string;
  price: number;
  optionCategories: OptionCategory[];
}

export interface Dog {
  id: string;
  petName: string;
  weight: number;
  birth: string;
  breed: string;
  breedType: number;
  neutering: boolean;
  sex: string;
  regNumber: string;
  phoneNumber: string;
}

export interface Customer {
  name: string;
  address: string;
  detailAddress: string;
  dogs: Dog[];
}

export interface UserDogsData {
  status: string;
  customers: Customer;
}

export interface ReservationData {
  Reservation: {
    pet_id: string;
    reservation_date: string;
    memo: string;
    status: string;
    consent_form: boolean;
    service_name: string;
    additional_services: string;
    total_price: number;
    additional_price: number;
  };
}
