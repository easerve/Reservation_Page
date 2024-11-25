"use server";

import {
  getReservationsByDateRange,
  getReservationsByPhone,
} from "@/actions/reservations";
import { getFirstDayOfNextMonth } from "@/utils/functions";

import { AdminReservationInfo, Reservation } from "@/types/interface";

export async function getReservationsOfOneMonth(
  year: number,
  month: number
): Promise<Reservation[]> {
  const startDate = `${year}-${month}-01`;
  const endDate = getFirstDayOfNextMonth(year, month);

  try {
    const res = await getReservationsByDateRange(startDate, endDate);
    console.log(res);
    return res.map((reservation: AdminReservationInfo) => ({
      id: reservation.uuid,
      time: new Date(reservation.reservation_date),
      breed: reservation.pet_id.breed_id.name,
      name: reservation.pet_id.name,
      weight: reservation.pet_id.weight,
      birth: reservation.pet_id.birth,
      phone: reservation.pet_id.user_id.phone,
      service_name: reservation.service_name,
      additional_services: reservation.additional_services,
      additional_price: reservation.additional_price,
      price: reservation.total_price,
      status: reservation.status,
      memo: reservation.memo,
    })) as Reservation[];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getReservationsByPhoneNumber(
  phoneNumber: string
): Promise<Reservation[]> {
  try {
    const res = await getReservationsByPhone(phoneNumber);
    return res.map((reservation: AdminReservationInfo) => ({
      id: reservation.uuid,
      time: new Date(reservation.reservation_date),
      breed: reservation.pet_id.breed_id.name,
      name: reservation.pet_id.name,
      weight: reservation.pet_id.weight,
      birth: reservation.pet_id.birth,
      phone: reservation.pet_id.user_id.phone,
      service_name: reservation.service_name,
      additional_services: reservation.additional_services,
      additional_price: reservation.additional_price,
      price: reservation.total_price,
      status: reservation.status,
      memo: reservation.memo,
    })) as Reservation[];
  } catch (e) {
    console.error(e);
    return [];
  }
}
