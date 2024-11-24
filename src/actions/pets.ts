"use server";

import { Database } from '@/types/definitions';
import { createServerSupabaseClient } from '@/utils/supabase/server';

export type BreedRow = Database["public"]["Tables"]["breeds"]["Row"];
export type PetInsert = Database["public"]["Tables"]["pets"]["Insert"];
export type PetRow = Database["public"]["Tables"]["pets"]["Row"];
export type UserRow = Database["public"]["Tables"]["user"]["Row"];

export interface PetInfo {
	petName: string;
	weight: number;
	birth: string;
	phoneNumber: string;
	breed: number;
	neutering: boolean;
	sex: string;
	regNumber: string;
	bite: boolean;
	heart_disease: boolean;
	underlying_disease: string;
}

export interface PetIdData {
	birth: string | null
	bite: boolean | null
	breed_id: number | null
	created_at: string | null
	heart_disease: boolean | null
	memo: string | null
	name: string | null
	neutering: boolean | null
	reg_number: string | null
	sex: string | null
	underlying_disease: string | null
	user_id: string | null
	uuid: string
	weight: number | null
	user: {
		uuid: string
		name: string | null
		phone: string
		address: string | null
		detail_address: string | null
	};
	breeds: {
		name: string
		type: string
	};
  }


function handleError(error: Error) {
  console.error('Error in /pets/breed:', error);
  throw new Error('Internal server error');
}

export async function getPetId(petId: string): Promise<PetIdData> {
	const supabase = await createServerSupabaseClient();

	const { data: petData, error: petError } = await supabase
		.from('pets')
		.select(`
			*,
			breeds(
				name,
				type(type)
			),
			user(
				uuid,
				name,
				phone,
				address,
				detail_address
			)
		`)
		.eq('uuid', petId)
		.single();
	if (petError) {
		if (petError.code === 'PGRST116') {
			throw new Error('Reservation not found');
		}
		handleError(petError);
	}
	return petData as unknown as PetIdData;
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
			neutering: petInfo.neutering,
			sex: petInfo.sex,
			reg_number: petInfo.regNumber,
			bite: petInfo.bite,
			heart_disease: petInfo.heart_disease,
			underlying_disease: petInfo.underlying_disease,
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


