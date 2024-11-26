"use server";

import {
  getReservationsByDateRange,
  getReservationsByPhone,
} from "@/actions/reservations";
import { getFirstDayOfNextMonth } from "@/utils/functions";

import { AdminReservationInfo, Reservation } from "@/types/interface";
import { getDogsByUserPhone } from "@/actions/auth";
import { Customer } from "@/types/booking";
import { ReservationInfo, ReservationDBInfo } from "@/types/api";

export async function getReservationsOfOneMonth(
  year: number,
  month: number,
): Promise<ReservationInfo[]> {
  const startDate = `${year}-${month}-01`;
  const endDate = getFirstDayOfNextMonth(year, month);

  try {
    const res = await getReservationsByDateRange(startDate, endDate);
    return res.map(
      (reservation: ReservationDBInfo) =>
        ({
          id: reservation.uuid,
          time: new Date(reservation.reservation_date),
          memo: reservation.memo,
          services: reservation.service_name,
          price: reservation.price,
          additional_service_name: reservation.additional_service_name,
          status: reservation.status,
          pet_id: reservation.pet_id,
          pets: reservation.pets,
        }) as ReservationInfo,
    );
    // return res.map((reservation: AdminReservationInfo) => ({
    //   id: reservation.uuid,
    //   time: new Date(reservation.reservation_date),
    //   breed: reservation.pet_id.breed_id.name,
    //   name: reservation.pet_id.name,
    //   weight: reservation.pet_id.weight,
    //   birth: reservation.pet_id.birth,
    //   phone: reservation.pet_id.user_id.phone,
    //   service_name: reservation.service_name,
    //   additional_services: reservation.additional_services,
    //   additional_price: reservation.additional_price,
    //   price: reservation.total_price,
    //   status: reservation.status,
    //   memo: reservation.memo,
    //   address: `${reservation.pet_id.user_id.address ?? "등록된 주소가 없습니다."} ${reservation.pet_id.user_id.detail_address ?? ""}`,
    // })) as Reservation[];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getReservationsByPhoneNumber(
  phoneNumber: string,
): Promise<ReservationInfo[]> {
  try {
    const res = await getReservationsByPhone(phoneNumber);
    return res.map(
      (reservation: ReservationDBInfo) =>
        ({
          id: reservation.uuid,
          time: new Date(reservation.reservation_date),
          services: reservation.service_name,
          price: reservation.total_price,
          additional_services: reservation.additional_services,
          additional_price: reservation.additional_price,
          status: reservation.status,
          pet_id: reservation.pet_id,
          memo: reservation.memo,
          pets: reservation.pets,
        }) as ReservationInfo,
    );
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getUserDataByPhoneNumber(phoneNumber: string) {
  try {
    const res = await getDogsByUserPhone(phoneNumber);
    if (res.status === "success") {
      // User 이미 존재
      return res.customers as Customer;
    } else {
      return res.customers as Customer;
    }
  } catch (e) {
    console.error(e);
    return {};
  }
}
