import { BookingData, BookingService } from '../types/booking';

export const INITIAL_BOOKING_STATE: BookingData = {
  dateTime: {
    date: undefined as Date | undefined,
    time: undefined as string | undefined,
  },
  petInfo: {
    petName: '',
    weight: undefined as number | undefined,
    phoneNumber: '',
  },
  mainService: undefined as BookingService | undefined,
  additionalServices: [],
  inquiry: '',
};

// TEST: 테스트 데이터

export const mainServices: BookingService[] = [
  {
    id: 'grooming',
    name: '위생미용 + 목욕',
    price: 25000,
    options: [
      { id: 'shampoo', name: '샴푸 업그레이드', addPrice: 10000 },
      { id: 'perfume', name: '향수 추가', addPrice: 5000 },
    ],
  },
  {
    id: 'clipping',
    name: '클리핑',
    price: 25000,
    options: [
      { id: 'nailTrim', name: '발톱 정리', addPrice: 5000 },
      { id: 'earCleaning', name: '귀 청소', addPrice: 8000 },
    ],
  },
  {
    id: 'sporting',
    name: '스포팅',
    price: 15000,
    options: [],
  },
  {
    id: 'scissorCut',
    name: '가위컷',
    price: 15000,
    options: [],
  },
];

export const additionalServices: BookingService[] = [
  { id: 'instep', name: '발등', price: 5000, options: [] },
  { id: 'tangle', name: '엉킴', price: 10000, options: [] },
];
