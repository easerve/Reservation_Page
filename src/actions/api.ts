"use server";

import { supabase } from "@/lib/utils";


export async function getReservations() {
  const start_date = "2024-11-01";
  const end_date = "2024-12-01";
  const { data, error } = await supabase.from("reservations").select("*").gte("reservation_date", new Date(start_date).toISOString()).lte("reservation_date", new Date(end_date).toISOString());
  if (error) {
    throw error;
  }
  return data;
}