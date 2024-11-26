import { NextRequest, NextResponse } from "next/server";
import { addReservation } from "@/actions/reservations";

import {
	getScopeReservations,
	getReservationId,
	updateReservation,
	deleteReservation,
	getReservationsByPhone,
} from "@/actions/reservations";
import { add } from "date-fns";

interface RequestBody {
	ReservationInfo: {
	  pet_id: string;
	  reservation_date: string;
	  memo: string;
	  status: string;
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
			const reservation = await getReservationId(reservationId);
			if (!reservation) {
				return NextResponse.json({ error: "No reservation found" }, { status: 404 });
			}
			const result = {
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

			}
			return NextResponse.json({ status: 'success', data: result });
		}
		else if (phone) {
			const reservations = await getReservationsByPhone(phone);
			if (!reservations) {
				return NextResponse.json({ data: [] }, { status: 200 });
			}
			const result = reservations.map(reservation => {
				return {
					id: reservation.uuid,
					time: reservation.reservation_date,
					breed: reservation.pets.breeds.name,
					name: reservation.pets.name,
					weight: reservation.pets.weight,
					birth: reservation.pets.birth,
					pet_memo: reservation.pets.memo,
					neutering: reservation.pets.neutering,
					sex: reservation.pets.sex,
					reg_number: reservation.pets.reg_number,
					bite: reservation.pets.bite,
					heart_disease: reservation.pets.heart_disease,
					service_name: reservation.service_name,
					additional_services: reservation.additional_services,
					additional_price: reservation.additional_price,
					total_price: reservation.total_price,
					status: reservation.status,
					memo: reservation.memo,
				};
			});
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
		const { pet_id, reservation_date, memo, status, service_name, additional_services, total_price, additional_price } = body.ReservationInfo;

		if (!pet_id || !reservation_date || !status || !service_name || !total_price) {
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
