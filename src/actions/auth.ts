"use server";

import { Database } from "@/types/definitions";
import { createServerSupabaseClient } from "@/utils/supabase/server";

export type UserRow = Database["public"]["Tables"]["user"]["Row"];
export type PetRow = Database["public"]["Tables"]["pets"]["Row"];
export type BreedRow = Database["public"]["Tables"]["breeds"]["Row"];


function handleError(error: any) {
	console.error(error);
	throw new Error(error.message);
}

export async function getUserDogs(phone: String) {
	const supabase = await createServerSupabaseClient();

	// Fetch user data
	const { data: userData, error: userError } = await supabase
		.from('user')
		.select('*')
		.eq('phone', phone)
		.maybeSingle();

	if (userError) {
		handleError(userError);
	}

	if (!userData) {
		return {
			status: "fail",
			customers: {
				name: "",
				phone: "",
				dogs: [],
			}
		};
	}

	// Fetch user's dogs
	const { data: petsData, error: petsError } = await supabase
		.from("pets")
		.select(`
			*,
			breeds (
			  name,
			  type
			)
		`)
		.eq("user_id", userData.uuid);

	if (petsError) {
		handleError(petsError);
	}

	const dogs = petsData?.map((pet) => ({
		id: pet.uuid,
		name: pet.name,
		breed: pet.breeds?.name,
		type: pet.breeds?.type,
		birth: pet.birth,
		weight: pet.weight,
	}));

	return {
		status: "success",
		customers: {
			name: userData.name,
			phone: userData.phone,
			dogs: dogs,
		}
	}
}
