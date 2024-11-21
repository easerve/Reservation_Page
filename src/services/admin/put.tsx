import { ReservationUpdate, updateReservation } from "@/actions/reservations";

export async function updateReservationState(
  reservationId: string,
  status: ReservationUpdate
) {
  try {
    const res = updateReservation(reservationId, status);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
