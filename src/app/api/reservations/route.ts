import { NextRequest, NextResponse } from "next/server";
import { addReservation } from "@/actions/reservations";

import {
	getScopeReservations,
	getReservationId,
	updateReservation,
	deleteReservation,
	getReservationsByPhone,
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
		const phone = searchParams.get("phone");
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
		else if (reservationId) {
			const reservation: AdminReservationInfo = await getReservationId(reservationId);
			const result = {
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
			}
			return NextResponse.json({ status: 'success', data: result });
		}
		else if (phone) {
			const reservations = await getReservationsByPhone(phone);
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
			return NextResponse.json({ status: 'success', data: result });
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
