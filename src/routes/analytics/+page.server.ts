import { requireUser } from '$lib/server/auth';
import { readStudyRecords } from '$lib/server/study-record-store';
import { getUniqueSubjects } from '$lib/utils/study-analytics';

export async function load(event) {
	const user = requireUser(event);
	const records = readStudyRecords(user.id);

	return {
		records,
		subjects: getUniqueSubjects(records)
	};
}
