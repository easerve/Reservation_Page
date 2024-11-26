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

export interface Option {
  name: string;
  price: number;
}

export interface OptionsData {
  [category: string]: Option[];
}

export interface MainService {
  id: number;
  name: string;
  price: number;
  options: Option[];
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
