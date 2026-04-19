import type {
	CompletionSlice,
	DashboardInsight,
	StudyRecord,
	SubjectBreakdown,
	SummaryMetrics,
	WeeklyPoint
} from '$lib/types';
import { formatDateLabel, formatMinutes, getLocalDateKey } from '$lib/utils/format';

const SUBJECT_COLORS = ['#0f766e', '#f59e0b', '#0f4c81', '#dc6b2f', '#5b8c5a', '#9a3412'];

export function getTodayKey(referenceDate = new Date()) {
	return getLocalDateKey(referenceDate);
}

export function getSummaryMetrics(
	records: StudyRecord[],
	todayKey = getTodayKey()
): SummaryMetrics {
	const totalTasks = records.length;
	const completedTasks = records.filter((record) => record.completed).length;
	const totalMinutes = records.reduce((total, record) => total + record.durationMinutes, 0);
	const todayRecords = records.filter((record) => record.date === todayKey);
	const todayMinutes = todayRecords.reduce((total, record) => total + record.durationMinutes, 0);

	return {
		totalTasks,
		completedTasks,
		incompleteTasks: totalTasks - completedTasks,
		completionRate: totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100,
		totalMinutes,
		totalHours: Number((totalMinutes / 60).toFixed(1)),
		todayCount: todayRecords.length,
		todayMinutes
	};
}

export function getWeeklySeries(
	records: StudyRecord[],
	days = 7,
	referenceDate = new Date()
): WeeklyPoint[] {
	const end = new Date(referenceDate);
	end.setHours(0, 0, 0, 0);
	const points: WeeklyPoint[] = [];

	for (let offset = days - 1; offset >= 0; offset -= 1) {
		const date = new Date(end);
		date.setDate(end.getDate() - offset);
		const dayKey = getLocalDateKey(date);
		const totalMinutes = records
			.filter((record) => record.date === dayKey)
			.reduce((sum, record) => sum + record.durationMinutes, 0);

		points.push({
			date: dayKey,
			label: formatDateLabel(dayKey),
			totalMinutes
		});
	}

	return points;
}

export function getSubjectBreakdown(records: StudyRecord[]): SubjectBreakdown[] {
	const subjectMap = new Map<string, SubjectBreakdown>();

	for (const record of records) {
		const key = record.subject.trim() || 'General';
		const existing =
			subjectMap.get(key) ??
			({
				subject: key,
				totalMinutes: 0,
				taskCount: 0,
				completedTasks: 0,
				color: SUBJECT_COLORS[subjectMap.size % SUBJECT_COLORS.length]
			} satisfies SubjectBreakdown);

		existing.totalMinutes += record.durationMinutes;
		existing.taskCount += 1;
		existing.completedTasks += Number(record.completed);
		subjectMap.set(key, existing);
	}

	return [...subjectMap.values()].sort((a, b) => b.totalMinutes - a.totalMinutes);
}

export function getCompletionSlices(records: StudyRecord[]): CompletionSlice[] {
	const completed = records.filter((record) => record.completed).length;
	const pending = records.length - completed;

	return [
		{ label: 'Completed', value: completed, color: '#15803d' },
		{ label: 'Incomplete', value: pending, color: '#b42318' }
	];
}

export function getUniqueSubjects(records: StudyRecord[]) {
	return [...new Set(records.map((record) => record.subject.trim()).filter(Boolean))].sort((a, b) =>
		a.localeCompare(b)
	);
}

export function getRecentRecords(records: StudyRecord[], limit = 5) {
	return [...records]
		.sort((a, b) => `${b.date}${b.updatedAt}`.localeCompare(`${a.date}${a.updatedAt}`))
		.slice(0, limit);
}

export function getAverageSessionMinutes(records: StudyRecord[]) {
	if (records.length === 0) return 0;
	return Math.round(
		records.reduce((sum, record) => sum + record.durationMinutes, 0) / records.length
	);
}

export function getLongestSession(records: StudyRecord[]) {
	return records.reduce<StudyRecord | null>((longest, record) => {
		if (!longest || record.durationMinutes > longest.durationMinutes) {
			return record;
		}

		return longest;
	}, null);
}

export function getStudyStreak(records: StudyRecord[], referenceDate = new Date()) {
	const uniqueDates = new Set(records.map((record) => record.date));
	let streak = 0;
	const cursor = new Date(referenceDate);
	cursor.setHours(0, 0, 0, 0);

	while (uniqueDates.has(getLocalDateKey(cursor))) {
		streak += 1;
		cursor.setDate(cursor.getDate() - 1);
	}

	return streak;
}

export function getDashboardInsights(records: StudyRecord[]): DashboardInsight[] {
	const topSubject = getSubjectBreakdown(records)[0];
	const longestSession = getLongestSession(records);
	const streak = getStudyStreak(records);
	const average = getAverageSessionMinutes(records);

	return [
		{
			label: 'Top subject',
			value: topSubject?.subject ?? 'No data yet',
			detail: topSubject
				? `${formatMinutes(topSubject.totalMinutes)} across ${topSubject.taskCount} task(s)`
				: 'Add study records to reveal your strongest focus area.'
		},
		{
			label: 'Longest session',
			value: longestSession ? formatMinutes(longestSession.durationMinutes) : 'No data yet',
			detail: longestSession
				? `${longestSession.title} on ${formatDateLabel(longestSession.date)}`
				: 'Your longest deep-work block will appear here.'
		},
		{
			label: 'Current streak',
			value: `${streak} day${streak === 1 ? '' : 's'}`,
			detail:
				streak > 0
					? 'Counted from today backwards using local calendar dates.'
					: 'Study today to begin a new streak.'
		},
		{
			label: 'Average session',
			value: formatMinutes(average),
			detail:
				records.length > 0
					? 'Useful for comparing short review sessions with deep study blocks.'
					: 'Average session length appears after your first task.'
		}
	];
}
