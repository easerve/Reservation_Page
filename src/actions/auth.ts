"use server";
import { createServerSupabaseClient } from "@/utils/supabase/server";

function handleError(error) {
  console.error(error);
  throw new Error(error.message);
}

export async function updateUser(request: Request) {
  try {
    const { id, name, phone, address, detailAddress } = await request.json();

    if (!id || !name || !phone || !address || !detailAddress) {
      return {
        status: "fail",
      };
    }

    const supabase = await createServerSupabaseClient();
    const { error: userError } = await supabase
      .from("user")
      .update({
        name,
        phone,
        address,
        detail_address: detailAddress,
      })
      .eq("phone", phone);

    if (userError) {
      handleError(userError);
    }

    return {
      status: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "fail",
    };
  }
}

export async function getDogsByUserPhone(phone: string) {
  const supabase = await createServerSupabaseClient();

  // Fetch user data
  const { data: userData, error: userError } = await supabase
    .from("user")
    .select("*")
    .eq("phone", phone)
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
      },
    };
  }

  // Fetch user's dogs
  const { data: petsData, error: petsError } = await supabase
    .from("pets")
    .select(
      `
			*,
			breeds (
			  name,
			  type,
        line_cut
			)
		`,
    )
    .eq("user_id", userData.uuid);

  if (petsError) {
    handleError(petsError);
  }

  const dogs = petsData?.map((pet) => ({
    id: pet.uuid,
    petName: pet.name,
    breed: pet.breeds.name,
    type: pet.breeds.type,
    birth: pet.birth,
    weight: pet.weight,
    neutering: pet.neutering,
    sex: pet.sex,
    regNumber: pet.reg_number,
    bite: pet.bite,
    heart_disease: pet.heart_disease,
    underlying_disease: pet.underlying_disease,
    line_cut: pet.breeds.line_cut,
  }));

  return {
    status: "success",
    customers: {
      id: userData.uuid,
      name: userData.name,
      phone: userData.phone,
      address: userData.address,
      detailAddress: userData.detail_address,
      dogs: dogs,
    },
  };
}
