import { deleteReservation as deleteReservationServer } from "@/actions/reservations";

export async function deleteReservation(id: string) {
  try {
    deleteReservationServer(id);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
