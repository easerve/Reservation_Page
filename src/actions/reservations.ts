"use server";

import { Database } from '@/types/definitions';
import { createServerSupabaseClient } from '@/utils/supabase/server';

export type ReservationRow = Database["public"]["Tables"]["reservations"]["Row"];
export type ReservationInsert = Database["public"]["Tables"]["reservations"]["Insert"];

interface ReservationInfo {
	pet_id: string;
	reservation_date: string;
	memo: string;
	services: number[];
	status: string;
	consent_form: boolean;
	additional_services: number[];
	total_price: number;
}

function handleError(error: Error) {
  console.error('Error in /reservations:', error);
  throw new Error('Internal server error');
}


export async function getReservations(scope: number) {
	const supabase = await createServerSupabaseClient();

	const today = new Date();
	const endDate = new Date();
	endDate.setMonth(today.getMonth() + scope);

	const formatDate = (date: Date) => date.toISOString().split('T')[0];

	const { data: reservationsData, error: reservationsError } = await supabase
		.from('reservations')
		.select('*')
		.gte('reservation_date', today.toISOString())
		.lte('reservation_date', endDate.toISOString());

	if (reservationsError) {
		handleError(reservationsError);
	}

	const reservationsMap: { [key: string]: string[] } = {};

	reservationsData?.forEach((reservation) => {
		const [date, time] = reservation.reservation_date!.split('T');
		const formattedTime = time.slice(0, 5);

		if (!reservationsMap[date]) {
			reservationsMap[date] = [];
		}
		reservationsMap[date].push(formattedTime);
	});

	const formattedReservations = Object.entries(reservationsMap).map(([date, times]) => ({
		date,
		times,
	}));
	return formattedReservations;
}

export async function addReservation(reservationInfo: ReservationInfo) {
	const supabase = await createServerSupabaseClient();

	// Insert reservation data
	const { data: insertData, error: insertError } = await supabase
		.from('reservations')
		.insert({
			pet_id: reservationInfo.pet_id,
			reservation_date: reservationInfo.reservation_date,
			memo: reservationInfo.memo,
			status: reservationInfo.status,
			consent_form: reservationInfo.consent_form,
			total_price: reservationInfo.total_price,
		})
		.select()
		.single();

	if (insertError) {
		handleError(insertError);
	}

	for (const serviceId of reservationInfo.services) {
		const { error: insertError } = await supabase
			.from('reservation_services')
			.insert({
				reservation_id: insertData!.uuid,
				service_id: serviceId,
			});

		if (insertError) {
			handleError(insertError);
		}
	}

	for (const additionalServiceId of reservationInfo.additional_services) {
		const { error: insertError } = await supabase
			.from('reservation_additional_services')
			.insert({
				reservation_id: insertData!.uuid,
				additional_service_id: additionalServiceId,
			});

		if (insertError) {
			handleError(insertError);
		}
	}

	return {
		status: "success"
	}
}
