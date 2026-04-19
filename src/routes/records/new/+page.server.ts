import { fail, redirect } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';
import {
	formDataToValues,
	readStudyRecords,
	saveStudyRecord,
	validateStudyRecord
} from '$lib/server/study-record-store';
import { getUniqueSubjects } from '$lib/utils/study-analytics';
import type { Actions } from './$types';

export async function load(event) {
	const user = requireUser(event);
	const records = readStudyRecords(user.id);

	return {
		subjects: getUniqueSubjects(records)
	};
}

export const actions: Actions = {
	upsert: async (event) => {
		const user = requireUser(event);
		const { request } = event;
		const formData = await request.formData();
		const values = formDataToValues(formData);
		const validation = validateStudyRecord(values);

		if (!validation.valid) {
			return fail(400, {
				errors: validation.errors,
				values
			});
		}

		saveStudyRecord(user.id, validation.data);
		throw redirect(303, '/records?status=created');
	}
};
