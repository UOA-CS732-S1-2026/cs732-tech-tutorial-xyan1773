export type StudyRecord = {
	id: string;
	title: string;
	subject: string;
	durationMinutes: number;
	date: string;
	completed: boolean;
	notes: string;
	createdAt: string;
	updatedAt: string;
};

export type AuthUser = {
	id: string;
	email: string;
	createdAt: string;
};

export type SessionRecord = {
	id: string;
	userId: string;
	expiresAt: string;
	createdAt: string;
};

export type SummaryMetrics = {
	totalTasks: number;
	completedTasks: number;
	incompleteTasks: number;
	completionRate: number;
	totalMinutes: number;
	totalHours: number;
	todayCount: number;
	todayMinutes: number;
};

export type DashboardInsight = {
	label: string;
	value: string;
	detail: string;
};

export type WeeklyPoint = {
	date: string;
	label: string;
	totalMinutes: number;
};

export type SubjectBreakdown = {
	subject: string;
	totalMinutes: number;
	taskCount: number;
	completedTasks: number;
	color: string;
};

export type CompletionSlice = {
	label: string;
	value: number;
	color: string;
};

export type StudyRecordInput = {
	title: string;
	subject: string;
	durationMinutes: number;
	date: string;
	completed: boolean;
	notes: string;
};

export type RecordFormValues = {
	id?: string;
	title: string;
	subject: string;
	durationMinutes: string;
	date: string;
	completed: boolean;
	notes: string;
};

export type RecordFormErrors = Partial<Record<keyof RecordFormValues, string>>;
