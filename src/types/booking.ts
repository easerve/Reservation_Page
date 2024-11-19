export interface BookingData {
  dateTime: BookingDateTime,
  petInfo: PetInfo,
  mainService: BookingService,
  additionalServices: BookingService[],
  price: number,
  inquiry: string,
}

export interface BookingDateTime {
  date?: Date,
  time?: string
}

export interface PetInfo {
  petName: string,
  weight: number,
  phoneNumber: string,
  age: number,
  breed: string,
}

export interface BookingService {
  id: string,
  name: string,
  price: number,
  options: OptionInfo[],
}

export interface OptionInfo {
  id: string,
  name: string,
  addPrice: number,
}