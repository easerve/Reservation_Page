import { NextRequest, NextResponse } from "next/server";
import { getServicesByWeightAndType, getAdditionalService } from "@/actions/services";

function parseServices(services: any[]) {
	return services.map((service) => {
	  // 옵션 카테고리를 그룹화하기 위한 Map 생성
	  const optionCategoryMap = new Map<number, { name: string; options: any[] }>();

	  service.service_name_id.service_option_group.forEach((group: any) => {
		const option = group.service_options;
		const categoryId = option.category_id;
		const categoryName = option.service_option_category.name;

		// 이미 존재하는 카테고리인지 확인하고 옵션 추가
		if (!optionCategoryMap.has(categoryId)) {
		  optionCategoryMap.set(categoryId, { name: categoryName, options: [] });
		}
		const category = optionCategoryMap.get(categoryId);
		if (category) {
		  category.options.push({
			id: option.id,
			name: option.name,
			price: option.price,
			category: categoryName,
		  });
		}
	  });

	  // optionCategories 배열 생성
	  const optionCategories = Array.from(optionCategoryMap.values());

	  return {
		id: service.id,
		name: service.service_name_id.name,
		price: service.price,
		optionCategories,
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
		const parsedServices = parseServices(services);
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
