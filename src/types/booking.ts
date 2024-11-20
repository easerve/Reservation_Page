export interface BookingData {
  phoneNumber: string;
  petInfo: PetInfo;
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
  id: number;
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
  name: string;
  price_min: number;
  price_max: number;
}

export interface Dog {
  id: String;
  name: string;
  weight: number;
  birth: string;
  breed: string;
  neutering: boolean;
  sex: string;
  regNumber: string;
  phoneNumber: string;
}

export interface Customer {
  dogs: Dog[];
}

export interface UserDogsData {
  status: string;
  customers: Customer;
}

export interface User {
  name: string;
  phone: string;
  address: string;
  detailAddress: string;
}
