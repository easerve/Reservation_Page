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

export async function addUser(request: Request) {
	try {
		const { name, phone, address, detailAddress } = await request.json();

		if (!name || !phone || !address || !detailAddress) {
			return {
				status: "fail"
			};
		}

		const supabase = await createServerSupabaseClient();
		const { data: userData, error: userError} = await supabase
			.from("user")
			.upsert(
				{
					name,
					phone,
					address,
					detail_address: detailAddress,
				},
			);

		if (userError) {
			handleError(userError);
		}

		return {
			status: "success"
		};
	} catch (error) {
		return {
			status: "fail"
		}
	}

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
				address: "",
				detailAddress: "",
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
		neutering: pet.neutering,
		sex: pet.sex,
		regNumber: pet.reg_number,
	}));

	return {
		status: "success",
		customers: {
			name: userData.name,
			phone: userData.phone,
			address: userData.address,
			detailAddress: userData.detail_address,
			dogs: dogs,
		}
	}
}
