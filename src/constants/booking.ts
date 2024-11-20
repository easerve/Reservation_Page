import {
  BookingData,
  MainService,
  AdditionalService,
  PetInfo,
} from "../types/booking";

export const LargeDog = {
  bath: 20000,
  pricing_per_kg: {
    beauty_bath: 7000,
    clipping: 10000,
    sporting: 13000,
    scissor_cut: 20000,
  },
};

export const INITIAL_BOOKING_STATE: BookingData = {
  dateTime: {
    date: new Date() as Date,
    time: undefined as string | undefined,
  },
  petInfo: {
    id: 0 as number,
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
