"use server";

import { TablesUpdate, TablesInsert } from "@/types/definitions";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { QueryData } from "@supabase/supabase-js";

type ReservationUpdate = TablesUpdate<"reservations">;
type ReservationInsert = TablesInsert<"reservations">;

function handleError(error: PostgrestError) {
  console.error("Error in /reservations:", error);
  throw new Error("Internal server error", error);
}

export async function getReservationsByPhone(
  phone: string,
  limit: number = 10,
) {
  const supabase = await createServerSupabaseClient();

  // 경고: !inner를 안하면 버그 발생함 user를 못 읽어옴
  const reservationWithPetQuery = supabase
    .from("reservations")
    .select(
      `
				*,
				pets!inner(
					*,
					user!inner(
						name,
						phone,
						address,
						detail_address
					),
					breeds(
						name,
						type,
						line_cut
					)
				)
		`,
    )
    .eq("pets.user.phone", phone)
    .limit(limit);
  type ReservationWithPet = QueryData<typeof reservationWithPetQuery>;
  const { data, error } = await reservationWithPetQuery;
  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Reservation not found");
    }
    handleError(error);
  }
  const result: ReservationWithPet = data;
  return result;
}

export async function getReservationId(reservationId: string) {
  const supabase = await createServerSupabaseClient();
  const reservationWithPetQuery = supabase
    .from("reservations")
    .select(
      `
			*,
			pets(
				*,
				user(
					name,
					phone,
					address,
					detail_address
				),
				breeds(
					name,
					type,
					line_cut
				)
			)
	`,
    )
    .eq("uuid", reservationId)
    .single();

  type ReservationWithPet = QueryData<typeof reservationWithPetQuery>;
  const { data, error } = await reservationWithPetQuery;
  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Reservation not found");
    }
    handleError(error);
  }
  const result: ReservationWithPet = data;
  return result;
}

export async function deleteReservation(reservationId: string) {
  const supabase = await createServerSupabaseClient();
  const { error: reservationError } = await supabase
    .from("reservations")
    .delete()
    .eq("uuid", reservationId);

  if (reservationError) {
    if (reservationError.code === "PGRST116") {
      throw new Error("Reservation not found");
    }
    handleError(reservationError);
  }
}

export async function updateReservation(
  reservationId: string,
  reservationInfo: ReservationUpdate,
) {
  const supabase = await createServerSupabaseClient();
  const { error: reservationError } = await supabase
    .from("reservations")
    .update(reservationInfo)
    .eq("uuid", reservationId);

  if (reservationError) {
    if (reservationError.code === "PGRST116") {
      throw new Error("Reservation not found");
    }
    handleError(reservationError);
  }
}

export async function getScopeReservations(scope: number) {
  const supabase = await createServerSupabaseClient();

  const today = new Date();
  const endDate = new Date();
  endDate.setMonth(today.getMonth() + scope);

  const { data: reservationsData, error: reservationsError } = await supabase
    .from("reservations")
    .select("*")
    .gte("reservation_date", today.toISOString())
    .lte("reservation_date", endDate.toISOString());

  if (reservationsError) {
    handleError(reservationsError);
  }

  const reservationsMap: { [key: string]: string[] } = {};

  reservationsData?.forEach((reservation) => {
    const [date, time] = reservation.reservation_date!.split("T");
    const formattedTime = time.slice(0, 5);

    if (!reservationsMap[date]) {
      reservationsMap[date] = [];
    }
    reservationsMap[date].push(formattedTime);
  });

  const formattedReservations = Object.entries(reservationsMap).map(
    ([date, times]) => ({
      date,
      times,
    }),
  );
  return formattedReservations;
}

export async function addReservation(reservationInfo: ReservationInsert) {
  const supabase = await createServerSupabaseClient();

  const { data: insertData, error: insertError } = await supabase
    .from("reservations")
    .insert(reservationInfo)
    .select()
    .single();

  if (insertError) {
    handleError(insertError);
  }

  return {
    status: "success",
    reservationId: insertData?.uuid,
  };
}

export async function getReservationsByDateRange(
  start_date: string,
  end_date: string,
) {
  const supabase = await createServerSupabaseClient();

  const { data: reservationData, error: reservationError } = await supabase
    .from("reservations")
    .select(
      `
		*,
		pets(
			*,
			user(
				name,
				phone,
				address,
				detail_address
			),
			breeds(
				name,
				type,
				line_cut
			)
		)
	`,
    )
    .gte("reservation_date", start_date)
    .lte("reservation_date", end_date);

  if (reservationError) {
    handleError(reservationError);
  }

  return reservationData;
}
