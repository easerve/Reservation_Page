import { NextRequest, NextResponse } from "next/server";
import { getServicesByWeightAndType, getAdditionalService } from "@/actions/services";

function transformMainServices(services: any[]) {
	return services.map((service) => {
		const options: any[] = [];

		service.service_name_id.service_option_group.forEach((group: any) => {
			const option = group.service_options;
			options.push({
				id: option.id,
				name: option.name,
				price: option.price,
				category: option.service_option_category.name,
			});
		});

		return {
			id: service.id,
			name: service.service_name_id.name,
			price: service.price,
			options,
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
		const parsedServices = transformMainServices(services);
		const additional_services = await getAdditionalService();
		return NextResponse.json({
			status: 'success',
			data: {
				mainServices: parsedServices,
				additional_services: additional_services
			}
		});
	} catch (error) {
		console.error("Error in /services:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
