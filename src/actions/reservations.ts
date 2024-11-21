"use server";


import { Database } from '@/types/definitions';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';

export type ReservationRow = Database["public"]["Tables"]["reservations"]["Row"];
export type ReservationInsert = Database["public"]["Tables"]["reservations"]["Insert"];
export type ReservationUpdate = Database["public"]["Tables"]["reservations"]["Update"];


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

interface AdminReservationInfo {
  uuid: string;
  reservation_date: string;
  memo: string | null;
  status: string;
  consent_form: boolean;
  additional_services: string | null;
  additional_price: number | null;
  total_price: number;
  service_name: string;
  pet_id: {
    name: string | null;
    birth: string | null;
    weight: number | null;
    user_id: {
      name: string | null;
      phone: string;
    };
    breed_id: {
      name: string;
    };
    memo: string | null;
    neutering: boolean | null;
    sex: string | null;
    reg_number: string | null;
  };
}


interface ReservationIdInfo {
	uuid: string;
	reservation_date: string;
	memo: string | null;
	status: string;
	consent_form: boolean;
	additional_services: string | null
	additional_price: number | null
	total_price: number;
	service_name: string;
	pet_id: {
		uuid: string;
		name: string | null;
		birth: string | null;
		weight: number | null;
		memo: string | null;
		neutering: boolean
	}
}

function handleError(error: PostgrestError) {
  console.error('Error in /reservations:', error);
  throw new Error('Internal server error', error);
}

export async function getReservationsByPhone(
	phone: string,
	limit: number = 10
) : Promise<AdminReservationInfo[]> {
	const supabase = await createServerSupabaseClient();
	const { data: reservationsData, error: reservationsError } = await supabase
		.from('reservations')
		.select(`
			uuid,
			reservation_date,
			memo,
			status,
			consent_form,
			additional_services,
			additional_price,
			total_price,
			service_name,
			pet_id!inner(
				name,
				birth,
				weight,
				memo,
				neutering,
				sex,
				reg_number,
				user_id!inner(
					name,
					phone
				),
				breed_id(
					name
				)
			)
		`)
		.eq('pet_id.user_id.phone', phone)
		.limit(limit);

	if (reservationsError) {
		if (reservationsError.code === 'PGRST116') {
			throw new Error('Reservation not found');
		}
		handleError(reservationsError);
	}
	return reservationsData as undefined as AdminReservationInfo[];
}

export async function getReservationId(reservationId: string) : Promise<AdminReservationInfo>{
	const supabase = await createServerSupabaseClient();
	const {data: reservationData, error: reservationError} = await supabase
		.from('reservations')
		.select(`
			uuid,
			reservation_date,
			memo,
			status,
			consent_form,
			additional_services,
			additional_price,
			total_price,
			service_name,
			pet_id(
				name,
				birth,
				weight,
				memo,
				neutering,
				sex,
				reg_number,
				user_id(
					name,
					phone
				),
				breed_id(
					name
				)
			)
		`)
		.eq('uuid', reservationId)
		.single();

	if (reservationError) {
		if (reservationError.code === 'PGRST116') {
			throw new Error('Reservation not found');
		}
		handleError(reservationError);
	}

	return reservationData as undefined as AdminReservationInfo;
}

export async function deleteReservation(reservationId: string) {
	const supabase = await createServerSupabaseClient();
	const {data: deleteData, error: reservationError} = await supabase
		.from('reservations')
		.delete()
		.eq('uuid', reservationId);

	if (reservationError) {
		if (reservationError.code === 'PGRST116') {
			throw new Error('Reservation not found');
		}
		handleError(reservationError);
	}
}

export async function updateReservation(
	reservationId: string,
	reservationInfo: ReservationUpdate
) {
	const supabase = await createServerSupabaseClient();
	const {data: updateData, error: reservationError} = await supabase
		.from('reservations')
		.update(reservationInfo)
		.eq('uuid', reservationId);

	if (reservationError) {
		if (reservationError.code === 'PGRST116') {
			throw new Error('Reservation not found');
		}
		handleError(reservationError);
	}
}

export async function getScopeReservations(scope: number) {
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
    .from("reservations")
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
  };
}

export async function getReservationsByDateRange(
  start_date: string,
  end_date: string
): Promise<AdminReservationInfo[]> {
  const supabase = await createServerSupabaseClient();

  const { data: reservationData, error: reservationError } = await supabase
    .from("reservations")
    .select(
      `
			uuid,
			reservation_date,
			memo,
			status,
			consent_form,
			additional_services,
			additional_price,
			total_price,
			service_name,
			pet_id(
				name,
				birth,
				weight,
				memo,
				neutering,
				sex,
				reg_number,
				user_id(
					name,
					phone
				),
				breed_id(
					name
				)
			)
		`)
		.gte("reservation_date", start_date)
		.lte("reservation_date", end_date);

	if (reservationError) {
		handleError(reservationError);
	}

	return reservationData as undefined as AdminReservationInfo[];
}
