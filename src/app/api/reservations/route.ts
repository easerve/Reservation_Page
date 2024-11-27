import { NextRequest, NextResponse } from "next/server";
import { addReservation } from "@/actions/reservations";
import { TablesInsert } from '@/types/definitions';
import {
	getScopeReservations,
	getReservationId,
	updateReservation,
	deleteReservation,
	getReservationsByPhone,
} from "@/actions/reservations";
import { getTimeSlot } from "@/actions/additional_time_slot";

type ReservationInsert = TablesInsert<'reservations'>;

interface RequestBody {
	ReservationInfo: ReservationInsert;
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
			const additionalTimeSlot = await getTimeSlot(scope);
			return NextResponse.json({
				status: 'success',
				booked_data: reservations,
				additional_booked_data: additionalTimeSlot,
			});
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
		const {
			pet_id,
			weight,
			reservation_date,
			service_name,
			additional_service_name,
			service_id,
			service_option_ids,
			inquiry,
			memo,
			status,
			price
		} = body.ReservationInfo;

		if (!pet_id || !reservation_date || !service_name || !service_id || !status  || !price) {
			console.log(body.ReservationInfo);
			return NextResponse.json(
				{ error: "Missing required fields in ReservationInfo" },
				{ status: 400 }
			);
		}

		const reservationInfo: ReservationInsert = {
			pet_id,
			weight,
			reservation_date,
			service_name,
			additional_service_name,
			service_id,
			service_option_ids,
			inquiry,
			memo,
			status,
			price,
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
