import { requireUser } from '$lib/server/auth';
import { readStudyRecords } from '$lib/server/study-record-store';
import {
	getCompletionSlices,
	getDashboardInsights,
	getRecentRecords,
	getSubjectBreakdown,
	getSummaryMetrics,
	getWeeklySeries
} from '$lib/utils/study-analytics';

export async function load(event) {
	const user = requireUser(event);
	const records = readStudyRecords(user.id);

	return {
		records,
		summary: getSummaryMetrics(records),
		weekly: getWeeklySeries(records),
		subjects: getSubjectBreakdown(records),
		completion: getCompletionSlices(records),
		recentRecords: getRecentRecords(records, 6),
		insights: getDashboardInsights(records)
	};
}
