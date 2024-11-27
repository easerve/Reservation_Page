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

export async function getTimeSlot(date: string) {
	try {
		const supabase = await createServerSupabaseClient();
		const startOfDay = `${date}T00:00:00`;
		const endOfDay = `${date}T23:59:59`;

		const getTimeSlotQuery = supabase
			.from("additional_time_slot")
			.select("*")
			.gte("slot_time", startOfDay)
			.lte("slot_time", endOfDay);

		type TimeSlot = QueryData<typeof getTimeSlotQuery>;
		const { data: timeSlot, error: timeSlotError } = await getTimeSlotQuery;
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
