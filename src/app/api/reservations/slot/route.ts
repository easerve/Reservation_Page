import { NextRequest, NextResponse } from "next/server";
import { createTimeSlot } from "@/actions/additional_time_slot";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { time } = body;
		const result = await createTimeSlot(time);
		return NextResponse.json(result);
	} catch (error) {
		console.error("Error in /additional_time_slot:", error);
		return NextResponse.json({ error: error.message }, { status: error.status || 500 });
	}
}
