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
          reservation: {
						id: reservation.uuid,
						time: reservation.reservation_date,
						service_name: reservation.service_name,
						additional_service_name: reservation.additional_service_name,
						service_id: reservation.service_id,
						service_option_ids: reservation.service_option_ids,
						inquiry: reservation.inquiry,
						memo: reservation.memo,
						status: reservation.status,
						price: reservation.price,
					},
					pet: {
						name: reservation.pets.name,
						breed: reservation.pets.breeds.name,
						weight: reservation.weight,
						birth: reservation.pets.birth,
						pet_memo: reservation.pets.memo,
						neutering: reservation.pets.neutering,
						sex: reservation.pets.sex,
						reg_number: reservation.pets.reg_number,
						bite: reservation.pets.bite,
						heart_disease: reservation.pets.heart_disease,
						underlying_disease: reservation.pets.underlying_disease,
						disk: reservation.pets.disk,
						phone: reservation.pets.user.phone,
					}
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
