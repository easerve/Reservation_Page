'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface BookingState {
  dateTime: { date: Date | undefined; time: string | undefined };
  petInfo: { petName: string; weight: string; phoneNumber: string };
  services: string[];
  inquiry: string;
}

interface BookingContextType {
  bookingData: BookingState;
  updateDateTime: (date: Date | undefined, time: string | undefined) => void;
  updatePetInfo: (info: { petName: string; weight: string; phoneNumber: string }) => void;
  updateServices: (services: string[]) => void;
  updateInquiry: (text: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingData, setBookingData] = useState<BookingState>({
    dateTime: { date: undefined, time: undefined },
    petInfo: { petName: '', weight: '', phoneNumber: '' },
    services: [],
    inquiry: '',
  });

  const updateDateTime = (date: Date | undefined, time: string | undefined) => {
    setBookingData(prev => ({ ...prev, dateTime: { date, time } }));
  };

  const updatePetInfo = (info: { petName: string; weight: string; phoneNumber: string }) => {
    setBookingData(prev => ({ ...prev, petInfo: info }));
  };

  const updateServices = (services: string[]) => {
    setBookingData(prev => ({ ...prev, services }));
  };

  const updateInquiry = (text: string) => {
    setBookingData(prev => ({ ...prev, inquiry: text }));
  };

  return (
    <BookingContext.Provider value={{ 
      bookingData, 
      updateDateTime, 
      updatePetInfo, 
      updateServices, 
      updateInquiry 
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
