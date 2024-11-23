import {
  BookingData,
  MainService,
  AdditionalService,
  Dog,
} from "../types/booking";

export const INITIAL_BOOKING_STATE: BookingData = {
  dateTime: {
    date: new Date() as Date,
    time: undefined as string | undefined,
  },
  dog: {
    id: "" as string,
    petName: "" as string,
    weight: 0 as number,
    birth: "" as string,
    breed: "" as string,
    breedType: 0 as number,
    neutering: false as boolean,
    sex: "" as string,
    regNumber: "" as string,
    phoneNumber: "" as string,
  } as Dog,
  phoneNumber: "" as string,
  mainService: undefined as MainService | undefined,
  additionalServices: [] as AdditionalService[],
  inquiry: "",
  price: [0, 0] as number[],
};

export const BIG_DOG_SERVICE_PRICES = [
  { id: 1, price_per_kg: 7000 },
  { id: 2, price_per_kg: 10000 },
  { id: 3, price_per_kg: 13000 },
  { id: 4, price_per_kg: 20000 },
];

export const ALL_TIME_SLOTS = ["10:00", "14:00", "17:00"];
