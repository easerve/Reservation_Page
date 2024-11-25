import { NextRequest, NextResponse } from "next/server";
import { addPet, getPetId, PetInfo, PetIdData } from "@/actions/pets";
import { Database } from "@/types/definitions";

type PetRow = Database["public"]["Tables"]["pets"]["Row"];


interface RequestBody {
  PetInfo: PetInfo;
}

interface addPetResponse {
  status: string;
  petInfo: PetRow;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const petId = searchParams.get("id");
    if (!petId) {
      return NextResponse.json({ error: "Pet ID is required" }, { status: 400 });
    }
    const petData: PetIdData = await getPetId(petId);
    const result = {
      petId: petData.uuid,
      petName: petData.name,
      weight: petData.weight,
      breed_name: petData.breeds.name,
      breed_type: petData.breeds.type,
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
    const body: RequestBody = await request.json();

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

    const result : addPetResponse = await addPet(petInfo);
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
