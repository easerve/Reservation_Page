"use server";

import { Database } from '@/types/definitions';
import { createServerSupabaseClient } from '@/utils/supabase/server';

export type BreedRow = Database["public"]["Tables"]["breeds"]["Row"];
export type PetInsert = Database["public"]["Tables"]["pets"]["Insert"];

interface PetInfo {
	petName: string;
	weight: number;
	birth: string;
	phoneNumber: string;
	breed: number;
	neutering: boolean;
	sex: string;
	regNumber: string;
}

function handleError(error: Error) {
  console.error('Error in /pets/breed:', error);
  throw new Error('Internal server error');
}

export async function addPet(petInfo: PetInfo) {
	const supabase = await createServerSupabaseClient();

	// Fetch user data
	let { data: userData, error: userError } = await supabase
		.from('user')
		.select('*')
		.eq('phone', petInfo.phoneNumber)
		.single();

	if (!userData) {
		const { data: newUserData, error: insertError } = await supabase
			.from('user')
			.insert({ phone: petInfo.phoneNumber })
			.select()
			.single();

		if (insertError) {
			throw insertError;
		}
		userData = newUserData;
	}


	// Insert pet data
	const { data: insertData, error: insertError } = await supabase
		.from('pets')
		.insert({
			name: petInfo.petName,
			birth: petInfo.birth,
			weight: petInfo.weight,
			user_id: userData!.uuid,
			breed_id: petInfo.breed,
		});

	if (insertError) {
		handleError(insertError);
	}

	return {
		status: "success"
	};
}

export async function getBreeds() {
	const supabase = await createServerSupabaseClient();

	const { data: breedsData, error: breedsError } = await supabase
		.from("breeds")
		.select("*");

	if (breedsError) {
		handleError(breedsError);
	}

	return {
		status: "success",
		data: breedsData,
	}
}


