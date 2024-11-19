import { NextRequest, NextResponse } from "next/server";
import { addReservation } from "@/actions/reservation";
import { getReservations } from "@/actions/reservation";

interface RequestBody {
	ReservationInfo: {
	  pet_id: string;
	  reservation_date: string;
	  memo: string;
	  status: string;
	  consent_form: boolean;
	  services: number[];
	  additional_services: number[];
	  total_price: number;
	}
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const scopeParam = searchParams.get("scope");
		const scope = scopeParam ? parseInt(scopeParam, 10) : 1;

		if (isNaN(scope) || scope < 1) {
			return NextResponse.json(
				{ error: "Invalid scope parameter" },
				{ status: 400 }
			);
		}
		const reservations = await getReservations(scope);
		return NextResponse.json({ status: 'success', data: reservations });
	} catch (error) {
		console.error("Error in /reservations:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const body: RequestBody = await request.json();

		if (!body.ReservationInfo) {
			return NextResponse.json(
				{ error: "Reservation info is required" },
				{ status: 400 }
			);
		}
		const { pet_id, reservation_date, memo, status, consent_form, services, additional_services, total_price } = body.ReservationInfo;

		if (!pet_id || !reservation_date || !memo || !status || !consent_form || !services || !additional_services || !total_price) {
			console.log(body.ReservationInfo);
			return NextResponse.json(
				{ error: "Missing required fields in ReservationInfo" },
				{ status: 400 }
			);
		}

		const reservationInfo = {
			pet_id,
			reservation_date,
			memo,
			status,
			consent_form,
			services,
			additional_services,
			total_price,
		};

		const result = await addReservation(reservationInfo);
		if (result.status === "success") {
			return NextResponse.json(result, { status: 200 });
		} else {
			return NextResponse.json({ error: "Failed to add reservation" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error in /reservations:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
