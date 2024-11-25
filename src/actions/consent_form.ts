"use server";

import { Database } from '@/types/definitions';
import { createServerSupabaseClient } from '@/utils/supabase/server';


type ConsentFormRow = Database["public"]["Tables"]["consent_form"]["Row"];
type ConsentFormInsert = Database["public"]["Tables"]["consent_form"]["Insert"];

export async function mappingConsentFormPetId(petId: string, consentFormUrl: string) {
	try {
		const supabase = await createServerSupabaseClient();
		const { error: consentFormError } = await supabase
			.from("consent_form")
			.insert({
				pet_id: petId,
				consent_form_url: consentFormUrl,
			});

		if (consentFormError) {
			throw new Error(consentFormError.message);
		}

		return {
			success: true,
		}
	} catch (error) {
		return {
			success: false,
			error: error.message,
		}
	}

}
