import {
  BookingData,
  MainService,
  AdditionalService,
  Dog,
} from '../types/booking';

export const INITIAL_BOOKING_STATE: BookingData = {
  dateTime: {
    date: new Date() as Date,
    time: undefined as string | undefined,
  },
  petInfo: {
    id: 0 as number,
    name: '' as string,
    weight: 0 as number,
    birth: '' as string,
    breed: '' as string,
  } as Dog,
  phoneNumber: '' as string,
  mainService: undefined as MainService | undefined,
  additionalServices: [] as AdditionalService[],
  inquiry: '',
};

// TEST: 테스트 데이터

export const mainServices: MainService[] = [
  {
    id: 1,
    name: '위생미용+목욕',
    price: 25000,
    options: [
      { id: 1, name: '곰돌이', price: 10000, category: '얼굴컷' },
      { id: 2, name: '크라운', price: 5000, category: '얼굴컷' },
      { id: 3, name: '앞머리', price: 5000, category: '얼굴컷' },
      { id: 4, name: '양치', price: 2000, category: '양치' },
    ],
  },
  {
    id: 2,
    name: '클리핑',
    price: 25000,
    options: [
      { id: 5, name: '6mm', price: 5000, category: '미리수' },
      { id: 6, name: '1cm', price: 10000, category: '미리수' },
      { id: 7, name: '2cm', price: 15000, category: '미리수' },
      { id: 8, name: '곰돌이', price: 10000, category: '얼굴컷' },
      { id: 9, name: '크라운', price: 5000, category: '얼굴컷' },
      { id: 10, name: '앞머리', price: 5000, category: '얼굴컷' },
      { id: 11, name: '양치', price: 2000, category: '양치' },
    ],
  },
  {
    id: 3,
    name: '스포팅',
    price: 15000,
    options: [],
  },
  {
    id: 4,
    name: '가위컷',
    price: 15000,
    options: [],
  },
];

export const additionalServices: AdditionalService[] = [
  { id: 1, name: '발등', price_min: 5000, price_max: 5000 },
  { id: 2, name: '엉킴', price_min: 10000, price_max: 10000 },
];

export const bookedDates = [
  { date: new Date('2024-11-20'), times: ['10:00', '14:00'] },
  { date: new Date('2024-11-21'), times: ['10:00', '17:00'] },
  { date: new Date('2024-11-22'), times: ['10:00', '14:00', '17:00'] },
];

export const breedDummyData = {
  breed: [
    {
      id: 1,
      breed: '푸들',
    },
    {
      id: 2,
      breed: '말티즈',
    },
  ],
};
