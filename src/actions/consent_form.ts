"use server";

import { Tables, TablesInsert } from '@/types/definitions';
import { createServerSupabaseClient } from '@/utils/supabase/server';


type ConsentFormRow = Tables<'consent_form'>;
type ConsentFormInsert = TablesInsert<'consent_form'>;

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
