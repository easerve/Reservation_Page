import { NextRequest, NextResponse } from 'next/server';
import { getServiceOptionById } from "@/actions/services";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const serviceId = searchParams.get("serviceNameId");

	if (!serviceId) {
		return NextResponse.json(
			{ error: "serviceId is required" },
			{ status: 400 }
		);
	}

	const serviceOptions = await getServiceOptionById(parseInt(serviceId, 10));
	if (!serviceOptions) {
		return NextResponse.json({ error: "No service options found" }, { status: 404 });
	}

	const groupedMap = new Map();

	serviceOptions.forEach((item) => {
		const category = item.service_options.service_option_category;
		const category_id = category.id;
		const category_name = category.name;

		if (!groupedMap.has(category_id)) {
			groupedMap.set(category_id, {
				category_id,
				category_name,
				options: [],
			});
		}

		const group = groupedMap.get(category_id);
		group.options.push({
			option_id: item.service_options.id,
			option_name: item.service_options.name,
			option_price: item.service_options.price,
      category_id: category_id,
		});
	});

	const groupedOptions = Array.from(groupedMap.values());

	return NextResponse.json({
		status: 'success',
		data: groupedOptions,
	});
}
