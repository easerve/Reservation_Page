"use server";
import { QueryData } from '@supabase/supabase-js';
import { createServerSupabaseClient } from "@/utils/supabase/server";

type MainService = {
	id: number;
	price: number;
	service_name_id: {
		id: number;
		name: string;
	};
}

function handleError(error: Error) {
	console.log('Error in /services:', error);
	throw new Error('Internal server error');
}

export async function getServicesByWeightAndType(weightRageId: number, typeId: number) {
	const supabase = await createServerSupabaseClient();

	const targetService = supabase
		.from("services")
		.select(`
			id,
			price,
			services_names(
				id,
				name
			)
		`)
		.eq("breed_type", typeId)
		.eq("weight_range", weightRageId);

	type Services = QueryData<typeof targetService>;
	const { data, error } = await targetService;
	if (error) {
		handleError(error);
	}
	const services : Services = data;
	return services;
}

export async function getServiceOptionById(serviceId: number) {
	const supabase = await createServerSupabaseClient();

	const serviceOptions = supabase
		.from('service_option_group')
		.select(`
			service_options(
				id,
				name,
				price,
				service_option_category(
					id,
					name
				)
			)
		`)
		.eq("services_name_id", serviceId);

	type ServiceOptions = QueryData<typeof serviceOptions>;
	const { data, error } = await serviceOptions;
	if (error) {
		handleError(error);
	}
	const options : ServiceOptions = data;
	return options;
}
