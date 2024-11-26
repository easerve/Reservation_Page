import { NextRequest, NextResponse } from "next/server";
import { getServicesByWeightAndType } from "@/actions/services";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const weightRangeId = searchParams.get("weightRangeId");
		const typeId = searchParams.get("typeId");

		if (!weightRangeId || !typeId) {
			return NextResponse.json(
				{ error: "Missing required parameters" },
				{ status: 400 }
			);
		}


		const services = await getServicesByWeightAndType(parseInt(weightRangeId, 10), parseInt(typeId, 10));
		if (!services) {
			return NextResponse.json({ error: "No services found" }, { status: 404 });
		}

		const result = services.map((service) => {
			return {
				id: service.services_names.id,
				name: service.services_names.name,
				price: service.price,
			};
		});
		return NextResponse.json({
			status: 'success',
			data: result,
		});
	} catch (error) {
		console.error("Error in /services:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
