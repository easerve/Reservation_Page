"use server";

import { Database } from '@/types/definitions';
import { createServerSupabaseClient } from '@/utils/supabase/server';

export type BreedRow = Database["public"]["Tables"]["breeds"]["Row"];
export type PetInsert = Database["public"]["Tables"]["pets"]["Insert"];
export type PetRow = Database["public"]["Tables"]["pets"]["Row"];

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

interface PetIdData {
	birth: string | null;
	breed_id: number | null;
	created_at: string | null;
	memo: string | null;
	name: string | null;
	neutering: boolean | null;
	reg_number: string | null;
	sex: string | null;
	uuid: string;
	weight: number | null;
	user_id: string | null;
	user: {
	  address: string | null;
	  detail_address: string | null;
	  name: string | null;
	  phone: string | null;
	  uuid: string;
	};
	breeds: {
	  name: string | null;
	  type: {
		type: string | null;
	  };
	}
}

interface addPetResponse {
	status: string;
	petInfo: PetRow;
}


function handleError(error: Error) {
  console.error('Error in pets action:', error);
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



export async function addPet(petInfo: PetInfo) : Promise<addPetResponse> {
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
		})
		.select()
		.single();

	if (insertError) {
		handleError(insertError);
	}
	return {
		status: "success",
		petInfo: insertData,
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


