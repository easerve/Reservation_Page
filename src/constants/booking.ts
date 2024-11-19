import { BookingData, BookingService } from '../types/booking';

export const INITIAL_BOOKING_STATE: BookingData = {
  dateTime: {
    date: new Date() as Date,
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
      { id: 'none', name: '선택안함', price: 0, options: [] },
      {
        id: 'faceCut',
        name: '얼굴컷',
        price: 0,
        options: [
          { id: 'bear', name: '곰돌이', price: 10000, options: [] },
          { id: 'ear', name: '귀툭튀, 하이바', price: 15000, options: [] },
        ],
      },
      {
        id: 'brushing',
        name: '양치 (개인 칫솔 지참)',
        price: 2000,
        options: [],
      },
    ],
  },
  {
    id: 'clipping',
    name: '클리핑',
    price: 25000,
    options: [
      {
        id: 'length',
        name: '미리수',
        price: 0,
        options: [
          { id: '6mm', name: '6mm', price: 5000, options: [] },
          { id: '1cm', name: '1cm', price: 10000, options: [] },
          { id: '2cm', name: '2cm', price: 15000, options: [] },
        ],
      },
      {
        id: 'faceCut',
        name: '얼굴컷',
        price: 0,
        options: [
          { id: 'bear', name: '곰돌이', price: 10000, options: [] },
          { id: 'ear', name: '귀툭튀, 하이바', price: 10000, options: [] },
        ],
      },
      {
        id: 'brushing',
        name: '양치 (개인 칫솔 지참)',
        price: 2000,
        options: [],
      },
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

export const bookedDates = [
  { date: new Date('2024-11-20'), times: ['10:00', '14:00'] },
  { date: new Date('2024-11-21'), times: ['10:00', '17:00'] },
  { date: new Date('2024-11-22'), times: ['10:00', '14:00', '17:00'] },
];
