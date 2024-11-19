import { NextRequest, NextResponse } from "next/server";
import { addPet } from "@/actions/pets";

interface RequestBody {
	PetInfo: {
	  petName: string;
	  weight: number;
	  phoneNumber: string;
	  birth: number;
	  breed: number;
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
		const { petName, weight, phoneNumber, birth, breed } = body.PetInfo;

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
		};

		const result = await addPet(petInfo);
		if (result.status === "success") {
			return NextResponse.json(result, { status: 200 });
		} else {
			return NextResponse.json({ error: "Failed to add pet" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error in /pets/breed:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
