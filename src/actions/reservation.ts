"use server";

import { Database } from '@/types/definitions';
import { createServerSupabaseClient } from '@/utils/supabase/server';

export type ReservationRow = Database["public"]["Tables"]["reservations"]["Row"];
export type ReservationInsert = Database["public"]["Tables"]["reservations"]["Insert"];
export type RservationUpdate = Database["public"]["Tables"]["reservations"]["Update"];
export type ReservationService = Database["public"]["Tables"]["reservation_services"]["Row"];
export type ReservationAdditionalService = Database["public"]["Tables"]["reservation_additional_services"]["Row"];
export type ReservationServiceOption = Database["public"]["Tables"]["reservation_services_option"]["Row"];
export type PetRow = Database["public"]["Tables"]["pets"]["Row"];
export type BreedRow = Database["public"]["Tables"]["breeds"]["Row"];


interface ReservationServiceData {
	service_id: {
		service_name_id: {
			name: string;
		};
	};
}

interface ReservationServiceOptionData {
	service_option_id: {
		name: string;
	};
}


interface ReservationAdditionalServiceData {
	additional_service_id: {
		service_name: string;
	};
}

function handleError(error: Error) {
	console.error('Error in /reservations:', error);
	throw new Error('Internal server error');
  }


export async function getReservationsByDateRange(start_date: string, end_date: string) {
	const supabase = await createServerSupabaseClient();

	const { data: reservationData, error: reservationError } = await supabase
		.from("reservations")
		.select(`
			uuid,
			reservation_date,
			memo,
			status,
			consent_form,
			additional_option,
			additional_price,
			pet_id(
				name,
				birth,
				weight,
				user_id(
					name,
					phone
				),
				breed_id(
					name
				),
				memo,
				neutering,
				sex,
				reg_number
			)
		`)
		.gte("reservation_date", start_date)
		.lte("reservation_date", end_date);

	if (reservationError) {
		handleError(reservationError);
	}

	return reservationData;
}

export async function getMainServiceNameById(uuid: string) {
	const supabase = await createServerSupabaseClient();

	const { data: serviceNameData, error: serviceNameError } = await supabase
		.from("reservation_services")
		.select(`
			service_id(
				service_name_id(
					name
				)
			)
		`)
		.eq("reservation_id", uuid)
		.returns<ReservationServiceData[]>();

	if (serviceNameError) {
		handleError(serviceNameError);
	}

	const serviceName = serviceNameData?.map(data => data.service_id.service_name_id.name).join(", ");
	return serviceName;
}

export async function getAdditionalServiceNameById(uuid: string) {
	const supabase = await createServerSupabaseClient();

	const { data: serviceNameData, error: serviceNameError } = await supabase
		.from("reservation_additional_services")
		.select(`
			additional_service_id(
				service_name
			)
		`)
		.eq("reservation_id", uuid)
		.returns<ReservationAdditionalServiceData[]>();

	if (serviceNameError) {
		handleError(serviceNameError);
	}

	const serviceName = serviceNameData?.map(data => data.additional_service_id.service_name).join(", ");
	return serviceName;
}

export async function getServiceOptionById(uuid: string) {
	const supabase = await createServerSupabaseClient();

	const { data: optionData, error: optionError } = await supabase
		.from("reservation_services_option")
		.select(`
			service_option_id(
				name
			)
		`)
		.eq("reservation_id", uuid)
		.returns<ReservationServiceOptionData[]>();

	if (optionError) {
		handleError(optionError);
	}

	const option = optionData?.map(data => data.service_option_id.name).join(", ");
	return option;
}
