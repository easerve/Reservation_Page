"use server";

import { Database } from '@/types/definitions';
import { createServerSupabaseClient } from '@/utils/supabase/server';

export type ReservationRow = Database["public"]["Tables"]["reservations"]["Row"];
export type ReservationInsert = Database["public"]["Tables"]["reservations"]["Insert"];

interface ReservationInfo {
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
			service_name: reservationInfo.service_name,
			additional_services: reservationInfo.additional_services,
			total_price: reservationInfo.total_price,
			additional_price: reservationInfo.additional_price,
		})
		.select()
		.single();

	if (insertError) {
		handleError(insertError);
	}

	return {
		status: "success",
		reservationId: insertData?.uuid,
	}
}
