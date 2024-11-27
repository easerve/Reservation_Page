'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { QueryData } from "@supabase/supabase-js";

export async function createTimeSlot(time: string) {
	try {
		const supabase = await createServerSupabaseClient();
		const createTimeSlotQuery = supabase
			.from("additional_time_slot")
			.insert({
				slot_time: time,
			})
			.select()
			.single();

		type TimeSlot = QueryData<typeof createTimeSlotQuery>;
		const { data: timeSlot, error: timeSlotError } = await createTimeSlotQuery;
		if (timeSlotError) {
			throw new Error(timeSlotError.message);
		}
		const result: TimeSlot = timeSlot;
		return {
			status: "success",
			data: result,
		}
	} catch (error) {
		return {
			status: "fail",
			error: error.message,
		}
	}
}

export async function getTimeSlot(scope: number) {
	try {
		const supabase = await createServerSupabaseClient();

		const today = new Date();
		const endDate = new Date();
		endDate.setMonth(today.getMonth() + scope);

		const getTimeSlotQuery = supabase
			.from("additional_time_slot")
			.select("*")
			.gte("slot_time", today.toISOString())
			.lte("slot_time", endDate.toISOString());

		type TimeSlot = QueryData<typeof getTimeSlotQuery>;
		const { data: timeSlot, error: timeSlotError } = await getTimeSlotQuery;
		if (timeSlotError) {
			throw new Error(timeSlotError.message);
		}
		const additionalTimeSlot: TimeSlot = timeSlot;
		const additionalTimeSlotMap: { [key: string]: string[] } = {};

		additionalTimeSlot.forEach((slot) => {
			const [date, time] = slot.slot_time.split("T");
			const formattedTime = time.slice(0, 5);

			if (!additionalTimeSlotMap[date]) {
				additionalTimeSlotMap[date] = [];
			}
			additionalTimeSlotMap[date].push(formattedTime);
		});

		const formattedAdditionalTimeSlot = Object.entries(additionalTimeSlotMap).map(
			([date, times]) => ({
				date,
				times,
			}),
		);
		return formattedAdditionalTimeSlot;
	} catch (error) {
		console.error("Error in getTimeSlot:", error);
		return {
			status: "fail",
			error: error.message,
		}
	}
}
