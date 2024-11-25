import { NextRequest, NextResponse } from "next/server";
import { getServicesByWeightAndType } from "@/actions/services";

type MainService = {
	id: number,
	price: number,
	service_name_id: {
		id: number,
		name: string
	}
}

type ParsedMainService = {
	id: number,
	name: string,
	price: number,
}

function parseMainServices(services: MainService[]) : ParsedMainService[] {
	return services.map((service) => {
		return {
			id: service.service_name_id.id,
			name: service.service_name_id.name,
			price: service.price,
		};
	});
}

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
		const parsedServices : ParsedMainService[] = parseMainServices(services);
		return NextResponse.json({
			status: 'success',
			data: {
				mainServices: parsedServices,
			}
		});
	} catch (error) {
		console.error("Error in /services:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
