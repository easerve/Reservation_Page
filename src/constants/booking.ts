import {
  BookingData,
  MainService,
  AdditionalService,
  PetInfo,
} from "../types/booking";

export const INITIAL_BOOKING_STATE: BookingData = {
  dateTime: {
    date: new Date() as Date,
    time: undefined as string | undefined,
  },
  petInfo: {
    id: "" as string,
    name: "" as string,
    weight: 0 as number,
    birth: "" as string,
    breed: "" as string,
  } as PetInfo,
  phoneNumber: "" as string,
  mainService: undefined as MainService | undefined,
  additionalServices: [] as AdditionalService[],
  inquiry: "",
};

export const BIG_DOG_SERVICE_PRICES = [
  { id: 1, price_per_kg: 7000 },
  { id: 2, price_per_kg: 10000 },
  { id: 3, price_per_kg: 13000 },
  { id: 4, price_per_kg: 20000 },
];
