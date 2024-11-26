"use server";

import { TablesInsert } from "@/types/definitions";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { QueryData } from "@supabase/supabase-js";

type PetInsert = TablesInsert<"pets">;

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

function handleError(error: Error) {
  console.error("Error in pets action:", error);
  throw new Error("Internal server error");
}

export async function getPetId(petId: string) {
  const supabase = await createServerSupabaseClient();
  const petWithUserQuery = supabase
    .from("pets")
    .select(
      `
			*,
			breeds(
				name,
				type,
				line_cut
			),
			user(
				uuid,
				name,
				phone,
				address,
				detail_address
			)
		`,
    )
    .eq("uuid", petId)
    .single();

  type PetWithUser = QueryData<typeof petWithUserQuery>;

  const { data, error } = await petWithUserQuery;
  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Pet not found");
    }
    handleError(error);
  }

  const petWithUser: PetWithUser = data;
  return petWithUser;
}

export async function addPet(petInfo: PetInfo) {
  const supabase = await createServerSupabaseClient();

  // Fetch user data
  let { data: userData } = await supabase
    .from("user")
    .select("*")
    .eq("phone", petInfo.phoneNumber)
    .single();

  if (!userData) {
    const { data: newUserData, error: insertError } = await supabase
      .from("user")
      .insert({ phone: petInfo.phoneNumber })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }
    userData = newUserData;
  }

  const petInsertData: PetInsert = {
    name: petInfo.petName,
    birth: petInfo.birth,
    weight: petInfo.weight,
    user_id: userData.uuid,
    breed_id: petInfo.breed,
    neutering: petInfo.neutering,
    sex: petInfo.sex,
    reg_number: petInfo.regNumber,
    bite: petInfo.bite,
    heart_disease: petInfo.heart_disease,
    underlying_disease: petInfo.underlying_disease,
  };
  // Insert pet data
  const { data: insertData, error: insertError } = await supabase
    .from("pets")
    .insert(petInsertData)
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
  };
}
