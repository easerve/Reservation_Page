import { NextRequest, NextResponse } from "next/server";
import { getReservationsByDateRange } from "@/actions/reservations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");

    if (!start_date || !end_date) {
      return NextResponse.json(
        { error: "start_date and end_date are required" },
        { status: 400 }
      );
    }
    const reservations = await getReservationsByDateRange(start_date, end_date);
    if (!reservations) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }
    const result = reservations.map((reservation) => {
        return {
          id: reservation.uuid,
          time: reservation.reservation_date,
          breed: reservation.pets.breeds.name,
          name: reservation.pets.name,
          weight: reservation.pets.weight,
          birth: reservation.pets.birth,
          phone: reservation.pets.user.phone,
          service_name: reservation.service_name,
          additional_services: reservation.additional_services,
          additional_price: reservation.additional_price,
          total_price: reservation.total_price,
          status: reservation.status,
          memo: reservation.memo,
        };
      });
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error("Error in /reservations/range:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
