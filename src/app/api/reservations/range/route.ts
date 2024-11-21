import { NextRequest, NextResponse } from "next/server";
import { getReservationsByDateRange } from "@/actions/reservations";
import { Database } from "@/types/definitions";

interface AdminReservationInfo {
    uuid: string;
    reservation_date: string;
    memo: string;
    status: string;
    consent_form: boolean;
    additional_services: string;
    additional_price: number;
    total_price: number;
    service_name: string;
    pet_id: {
        name: string;
        birth: string;
        weight: number;
        user_id: {
            name: string;
            phone: string;
        };
        breed_id: {
            name: string;
        };
        memo: string;
        neutering: boolean;
    };
}

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
    const result = await Promise.all(
      reservations.map(async (reservation: AdminReservationInfo) => {
        return {
          id: reservation.uuid,
          time: reservation.reservation_date,
          breed: reservation.pet_id.breed_id.name,
          name: reservation.pet_id.name,
          weight: reservation.pet_id.weight,
          birth: reservation.pet_id.birth,
          phone: reservation.pet_id.user_id.phone,
          service_name: reservation.service_name,
          additional_services: reservation.additional_services,
          additional_price: reservation.additional_price,
          total_price: reservation.total_price,
          status: reservation.status,
          consent_form: reservation.consent_form,
          memo: reservation.memo,
        };
      })
    );
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error("Error in /reservations/range:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
