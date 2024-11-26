import { NextRequest, NextResponse } from "next/server";
import { addPet, getPetId } from "@/actions/pets";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const petId = searchParams.get("id");
    if (!petId) {
      return NextResponse.json({ error: "Pet ID is required" }, { status: 400 });
    }
    const petData = await getPetId(petId);
    const result = {
      petId: petData.uuid,
      petName: petData.name,
      birth: petData.birth,
      weight: petData.weight,
      memo: petData.memo,
      breed_name: petData.breeds.name,
      breed_type: petData.breeds.type,
      line_cut: petData.breeds.line_cut,
      neutering: petData.neutering,
      sex: petData.sex,
      regNumber: petData.reg_number,
      bite: petData.bite,
      heart_disease: petData.heart_disease,
      underlying_disease: petData.underlying_disease,
      user: petData.user,
    }
    return NextResponse.json({ PetProfile: result }, { status: 200 });
  } catch (error) {
    console.error("Error in /pets/breed:", error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.PetInfo) {
      return NextResponse.json(
        { error: "Pet info is required" },
        { status: 400 }
      );
    }
    const {
      petName,
      weight,
      phoneNumber,
      birth,
      breed,
      neutering,
      sex,
      regNumber,
      bite,
      heart_disease,
      underlying_disease,
    } = body.PetInfo;

    if (!petName || !weight || !phoneNumber || !birth || !breed ) {
      // TODD: Add more validation
      return NextResponse.json(
        { error: "Missing required fields in PetInfo" },
        { status: 400 }
      );
    }

    const petInfo = {
      petName,
      weight,
      phoneNumber,
      birth: new Date(birth).toISOString(),
      breed,
      neutering,
      sex,
      regNumber,
      bite,
      heart_disease,
      underlying_disease,
    };

    const result = await addPet(petInfo);
    if (result.status === "success") {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to add pet" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in /pets/breed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
