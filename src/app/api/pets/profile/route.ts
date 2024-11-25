import { NextRequest, NextResponse } from "next/server";
import { addPet, getPetId } from "@/actions/pets";
import { Database } from "@/types/definitions";

type PetRow = Database["public"]["Tables"]["pets"]["Row"];


interface RequestBody {
  PetInfo: {
    petName: string;
    weight: number;
    phoneNumber: string;
    birth: number;
    breed: number;
    neutering: boolean;
    sex: string;
    regNumber: string;
  };
}

interface PetData {
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



export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const petId = searchParams.get("id");

    if (!petId) {
      return NextResponse.json({ error: "Pet ID is required" }, { status: 400 });
    }
    const petData: PetData = await getPetId(petId);
    const result = {
      petId: petData.uuid,
      petName: petData.name,
      weight: petData.weight,
      breed_name: petData.breeds.name,
      breed_type: petData.breeds.type.type,
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
    } = body.PetInfo;

    if (!petName || !weight || !phoneNumber || !birth || !breed) {
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
