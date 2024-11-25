"use client";

import React, { useState, useEffect } from "react";
import PhoneNumberStep from "./components/PhoneNumberStep";
import PetSelectionStep from "./components/PetSelectionStep";
import DateTimeSelectionStep from "./components/DateTimeSelectionStep";
import ServiceSelectionStep from "./components/ServiceSelectionStep";
import ConfirmationStep from "./components/ConfirmationStep";
import { BookingData, Customer, UserDogsData, Dog } from "@/types/booking";
import { INITIAL_BOOKING_STATE } from "@/constants/booking";

export default function Booking() {
  const [isPuppyAdd, setIsPuppyAdd] = useState(false);

  const [userDogsData, setUserDogsData] = useState<UserDogsData>({
    status: "" as string,
    customers: {
      id: "" as string,
      name: "" as string,
      phone: "" as string,
      address: "" as string,
      detailAddress: "" as string,
      dogs: [] as Dog[],
    } as Customer,
  });

  useEffect(() => {
    if (isPuppyAdd) {
      getUserData({ phoneNumber: userDogsData.customers.phone }).then(() => {
        setIsPuppyAdd(!isPuppyAdd);
      });
    }
  }, [isPuppyAdd, userDogsData]);

  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>(
    INITIAL_BOOKING_STATE
  );

  const [breeds, setBreeds] = useState<
    { id: number; name: string; type: number }[]
  >([]);

  useEffect(() => {
    const loadBreeds = async () => {
      try {
        const breedData = await fetch("/api/pets/breed");
        const breedOptions = await breedData.json();
        setBreeds(breedOptions.data);
      } catch (error) {
        console.error("Error fetching breeds:", error);
      }
    };
    loadBreeds();
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PhoneNumberStep
            bookingData={bookingData}
            setBookingData={setBookingData}
            setCurrentStep={setCurrentStep}
            getUserData={getUserData}
          />
        );

      case 2:
        return (
          <PetSelectionStep
            bookingData={bookingData}
            setBookingData={setBookingData}
            setCurrentStep={setCurrentStep}
            userDogsData={userDogsData}
            breeds={breeds}
            setIsPuppyAdd={setIsPuppyAdd}
          />
        );

      case 3:
        return (
          <DateTimeSelectionStep
            bookingData={bookingData}
            setBookingData={setBookingData}
            setCurrentStep={setCurrentStep}
          />
        );

      case 4:
        return (
          <ServiceSelectionStep
            bookingData={bookingData}
            setBookingData={setBookingData}
            setCurrentStep={setCurrentStep}
            breeds={breeds}
          />
        );

      case 5:
        return (
          <ConfirmationStep
            bookingData={bookingData}
            setBookingData={setBookingData}
            setCurrentStep={setCurrentStep}
            userDogsData={userDogsData}
          />
        );
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">이리온댕댕 예약</h1>
        <div className="flex justify-between mt-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 mx-1 rounded ${
                step <= currentStep ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
      {renderStep()}
    </div>
  );

  async function getUserData(values: { phoneNumber: string }) {
    try {
      const res = await fetch("/api/auth/profile?phone=" + values.phoneNumber);
      const data = await res.json();
      console.log(data);

      setUserDogsData(data);
    } catch (error) {
      console.error(error);
    }
  }
}
