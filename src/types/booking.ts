export interface BookingData {
  phoneNumber: string;
  dog: Dog;
  dateTime: BookingDateTime;
  mainService?: MainService;
  additionalServices: AdditionalService[];
  inquiry: string;
}

export interface BookingDateTime {
  date: Date;
  time?: string;
}

export interface PetInfo {
  id: string;
  name: string;
  weight: number;
  birth: string;
  breed: string;
}

export interface Option {
  id: number;
  name: string;
  price: number;
  category: string;
}

export interface MainService {
  id: number;
  name: string;
  price: number;
  options: Option[];
}

export interface AdditionalService {
  id: number;
  service_name: string;
  price_min: number;
  price_max: number;
}

export interface Dog {
  id: String;
  petName: string;
  weight: number;
  birth: string;
  breed: number;
  neutering: boolean;
  sex: string;
  regNumber: string;
  phoneNumber: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  detailAddress: string;
  dogs: Dog[];
}

export interface UserDogsData {
  status: string;
  customers: Customer;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  address: string;
  detailAddress: string;
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
