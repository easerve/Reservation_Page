export interface BookingData {
  dateTime: BookingDateTime;
  petInfo: PetInfo;
  mainService?: BookingService;
  additionalServices: BookingService[];
  inquiry: string;
}

export interface BookingDateTime {
  date?: Date;
  time?: string;
}

export interface PetInfo {
  petName: string;
  weight: number | undefined;
  phoneNumber: string;
}

export interface BookingService {
  id: string;
  name: string;
  price: number;
  isRequired?: boolean;
  options: BookingService[];
}
