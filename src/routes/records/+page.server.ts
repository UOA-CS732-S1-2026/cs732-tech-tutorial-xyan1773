import { fail, redirect } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';
import type { Actions } from './$types';
import {
	deleteStudyRecord,
	formDataToValues,
	readStudyRecords,
	resetStudyRecordsForUser,
	saveStudyRecord,
	toggleStudyRecord,
	validateStudyRecord
} from '$lib/server/study-record-store';
import { getSummaryMetrics, getUniqueSubjects } from '$lib/utils/study-analytics';

export async function load(event) {
	const user = requireUser(event);
	const records = readStudyRecords(user.id);
	const { url } = event;
	const status = url.searchParams.get('status');

	return {
		records,
		subjects: getUniqueSubjects(records),
		summary: getSummaryMetrics(records),
		feedback:
			status === 'created'
				? 'Study record added successfully.'
				: status === 'updated'
					? 'Study record updated successfully.'
					: status === 'deleted'
						? 'Study record deleted successfully.'
						: status === 'toggled'
							? 'Study task status updated.'
							: status === 'reset'
								? 'Demo study records restored successfully.'
								: null
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
				values,
				editingId: values.id ?? null
			});
		}

		saveStudyRecord(user.id, validation.data, values.id);
		throw redirect(303, `/records?status=${values.id ? 'updated' : 'created'}`);
	},

	toggle: async (event) => {
		const user = requireUser(event);
		const { request } = event;
		const formData = await request.formData();
		const id = formData.get('id');

		if (typeof id === 'string' && id) {
			toggleStudyRecord(user.id, id);
		}

		return { ok: true };
	},

	delete: async (event) => {
		const user = requireUser(event);
		const { request } = event;
		const formData = await request.formData();
		const id = formData.get('id');

		if (typeof id === 'string' && id) {
			deleteStudyRecord(user.id, id);
		}

		throw redirect(303, '/records?status=deleted');
	},

	reset: async (event) => {
		const user = requireUser(event);
		resetStudyRecordsForUser(user.id);
		throw redirect(303, '/records?status=reset');
	}
};
