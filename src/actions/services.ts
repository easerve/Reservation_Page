"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

function handleError(error: Error) {
	console.log('Error in /services:', error);
	throw new Error('Internal server error');
}

export async function getServicesByWeightAndType(weightRageId: number, typeId: number) {
	const supabase = await createServerSupabaseClient();

	const { data: services, error: servicesError } = await supabase
		.from("services")
		.select(`
			id,
			price,
			service_name_id(
				id,
				name,
				service_option_group (
					service_option_id,
					service_options (
						id,
						name,
						price,
						category_id,
						service_option_category (
							id,
							name
						)
					)
				)
			)
		`)
		.eq("breed_type", typeId)
		.eq("weight_range", weightRageId);

	if (servicesError) {
		handleError(servicesError);
	}

	return services;
}

export async function getAdditionalService() {
	const supabase = await createServerSupabaseClient();

	const { data: additionalServices, error: additionalServicesError } = await supabase
		.from("additional_services")
		.select(`
			id,
			service_name,
			price_min,
			price_max
		`);

	if (additionalServicesError) {
		handleError(additionalServicesError);
	}

	return additionalServices;
}
