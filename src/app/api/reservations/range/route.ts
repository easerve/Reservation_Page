import { NextRequest, NextResponse } from "next/server";
import {
  getReservationsByDateRange,
  getMainServiceNameById,
  getAdditionalServiceNameById,
  getServiceOptionById,
} from "@/actions/reservation";

import { Database } from "@/types/definitions";

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
      reservations.map(async (reservation) => {
        const serviceName = await getMainServiceNameById(reservation.uuid);
        const serviceOptionName = await getServiceOptionById(reservation.uuid);
        const additionalServiceName = await getAdditionalServiceNameById(
          reservation.uuid
        );
        const concatenatedNames = [
          serviceName,
          serviceOptionName,
          additionalServiceName,
        ]
          .filter((name) => name && name.trim() !== "") // 빈 값 제거
          .join(", ");
        return {
          id: reservation.uuid,
          time: reservation.reservation_date,
          breed: reservation.pet_id.breed_id.name,
          name: reservation.pet_id.name,
          weight: reservation.pet_id.weight,
          birth: reservation.pet_id.birth,
          phone: reservation.pet_id.user_id.phone,
          service_name: concatenatedNames,
          additional_price: reservation.additional_price,
          additional_option: reservation.additional_option,
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
