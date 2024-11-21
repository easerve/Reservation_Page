import { NextRequest, NextResponse } from "next/server";
import { addReservation } from "@/actions/reservations";

import {
	getScopeReservations,
	getReservationId,
	updateReservation,
	deleteReservation,
} from "@/actions/reservations";

interface RequestBody {
	ReservationInfo: {
	  pet_id: string;
	  reservation_date: string;
	  memo: string;
	  status: string;
	  consent_form: boolean;
	  service_name: string;
	  additional_services: string;
	  total_price: number;
	  additional_price: number;
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const reservationId = searchParams.get("id");
		const body: RequestBody = await request.json();

		if (!reservationId) {
			return NextResponse.json(
				{ error: "Reservation ID is required" },
				{ status: 400 }
			);
		}
		deleteReservation(reservationId);
		return NextResponse.json({ status: 'success' });
	} catch (error) {
		console.error("Error in /reservations:", error);
		return NextResponse.json({ error: error.message }, { status: error.status || 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const reservationId = searchParams.get("id");
		const body: RequestBody = await request.json();

		if (!reservationId) {
			return NextResponse.json(
				{ error: "Reservation ID is required" },
				{ status: 400 }
			);
		}
		updateReservation(reservationId, body.ReservationInfo);
		return NextResponse.json({ status: 'success' });

	} catch (error) {
		console.error("Error in /reservations:", error);
		return NextResponse.json({ error: error.message }, { status: error.status || 500 });
	}
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const scopeParam = searchParams.get("scope");
		const reservationId = searchParams.get("id");
		if (scopeParam) {
			const scope = scopeParam ? parseInt(scopeParam, 10) : 1;

			if (isNaN(scope) || scope < 1) {
				return NextResponse.json(
					{ error: "Invalid scope parameter" },
					{ status: 400 }
				);
			}
			const reservations = await getScopeReservations(scope);
			return NextResponse.json({ status: 'success', data: reservations });
		}
		if (reservationId) {
			const reservation = await getReservationId(reservationId);
			return NextResponse.json({ status: 'success', data: reservation });
		}

	} catch (error) {
		console.error("Error in /reservations:", error);
		return NextResponse.json({ error: error.message }, { status: error.status || 500 });
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
		const { pet_id, reservation_date, memo, status, consent_form, service_name, additional_services, total_price, additional_price } = body.ReservationInfo;

		if (!pet_id || !reservation_date || !status || !consent_form || !service_name || !total_price) {
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
			service_name,
			additional_services,
			total_price,
			additional_price
		};

		const result = await addReservation(reservationInfo);
		if (result.status === "success") {
			return NextResponse.json(
				{
					message: "예약이 성공적으로 완료되었습니다.",
					reservationId: result.reservationId,
				},
				{ status: 200 }
			);
		} else {
			return NextResponse.json({ error: "Failed to add reservation" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error in /reservations:", error);
		return NextResponse.json({ error: error.message }, { status: error.status || 500 });
	}
}
