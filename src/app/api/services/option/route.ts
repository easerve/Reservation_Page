import { NextRequest, NextResponse } from 'next/server';
import { getServiceOptionById } from "@/actions/services";
import { ca } from 'date-fns/locale';


type ServiceOption = {
	service_options: {
		name: string;
		price: number;
		service_option_category: {
			id: number;
			name: string;
		}
	}
}

type Option = {
	name: string;
	price: number;
};

function categorizeServiceOptions(serviceOptions: ServiceOption[]) {
	const categorizedOptions: Record<string, Option[]> = {};

	serviceOptions.forEach((option) => {
		const category = option.service_options.service_option_category.name;
		const optionData = {
			name: option.service_options.name,
			price: option.service_options.price,
		}
		if (!categorizedOptions[category]) {
			categorizedOptions[category] = [];
		}
		categorizedOptions[category].push(optionData);
	});

	return categorizedOptions;
}

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const serviceId = searchParams.get("serviceId");

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
	const categorizedOptions = categorizeServiceOptions(serviceOptions);
	return NextResponse.json({
		status: 'success',
		data: categorizedOptions,
	});
}
