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
  const reservationData = supabase
    .from("reservations")
    .select(
      `
			uuid,
			reservation_date,
			memo,
			status,
			additional_services,
			additional_price,
			total_price,
			service_name,
			pets(
				name,
				birth,
				weight,
				memo,
				neutering,
				sex,
				reg_number,
				bite,
				heart_disease,
				underlying_disease,
				user(
					name,
					phone
				),
				breeds(
					name
				)
			)
		`,
    )
    .eq("pets.user.phone", phone)
    .limit(limit);

  type ReservationData = QueryData<typeof reservationData>;
  const { data, error } = await reservationData;
  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Reservation not found");
    }
    handleError(error);
  }
  const result: ReservationData = data;
  return result;
}

export async function getReservationId(reservationId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: reservationData, error: reservationError } = await supabase
    .from("reservations")
    .select(
      `
			uuid,
			reservation_date,
			memo,
			status,
			additional_services,
			additional_price,
			total_price,
			service_name,
			pets(
				name,
				birth,
				weight,
				memo,
				neutering,
				sex,
				reg_number,
				bite,
				heart_disease,
				underlying_disease,
				user(
					name,
					phone,
          address,
          detail_address
				),
				breeds(
					name
				)
			)
		`,
    )
    .eq("uuid", reservationId)
    .single();

  if (reservationError) {
    if (reservationError.code === "PGRST116") {
      throw new Error("Reservation not found");
    }
    handleError(reservationError);
  }

  return reservationData;
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

// TODO: 예약 정보 추가해서 정리하기
export async function addReservation(reservationInfo: ReservationInsert) {
  const supabase = await createServerSupabaseClient();

  // Insert reservation data
  const { data: insertData, error: insertError } = await supabase
    .from("reservations")
    .insert({
      pet_id: reservationInfo.pet_id,
      reservation_date: reservationInfo.reservation_date,
      memo: reservationInfo.memo,
      status: reservationInfo.status,
      service_name: reservationInfo.service_name,
      additional_services: reservationInfo.additional_services,
      total_price: reservationInfo.total_price,
      additional_price: reservationInfo.additional_price,
    })
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
		uuid,
		reservation_date,
		memo,
		status,
		additional_services,
		additional_price,
		total_price,
		service_name,
		pets(
			name,
			birth,
			weight,
			memo,
			neutering,
			sex,
			reg_number,
			bite,
			heart_disease,
			underlying_disease,
			user(
				name,
				phone
			),
			breeds(
				name
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
