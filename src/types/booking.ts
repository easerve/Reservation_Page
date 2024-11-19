export interface BookingData {
  dateTime: BookingDateTime;
  petInfo: PetInfo;
  mainService?: BookingService;
  additionalServices: BookingService[];
  inquiry: string;
}

export interface BookingDateTime {
  date: Date;
  time?: string;
}

export interface PetInfo {
  petName: string,
  weight: number,
  phoneNumber: string,
  birth: string,
  breed: string,
}

export interface BookingService {
  id: string;
  name: string;
  price: number;
  options: BookingService[];
}

export interface Dog {
  id: string;
  name: string;
  weight: number;
  birth: string;
  breed: string;
}

export interface Customer {
  dogs: Dog[];
}

export interface UserDogsData {
  status: string;
  customers: Customer;
}
