import { randomUUID } from 'node:crypto';
import { db } from '$lib/server/db';
import { sampleStudyRecords } from '$lib/server/sample-study-records';
import type { RecordFormErrors, RecordFormValues, StudyRecord, StudyRecordInput } from '$lib/types';

type DbStudyRecord = {
	id: string;
	user_id: string;
	title: string;
	subject: string;
	duration_minutes: number;
	date: string;
	completed: number;
	notes: string;
	created_at: string;
	updated_at: string;
};

function mapRecord(row: DbStudyRecord): StudyRecord {
	return {
		id: row.id,
		title: row.title,
		subject: row.subject,
		durationMinutes: row.duration_minutes,
		date: row.date,
		completed: Boolean(row.completed),
		notes: row.notes,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}

export function readStudyRecords(userId: string): StudyRecord[] {
	const rows = db
		.prepare(
			`SELECT * FROM study_records
			 WHERE user_id = ?
			 ORDER BY date DESC, updated_at DESC`
		)
		.all(userId) as DbStudyRecord[];

	return rows.map(mapRecord);
}

export function saveStudyRecord(userId: string, input: StudyRecordInput, id?: string) {
	const timestamp = new Date().toISOString();

	if (id) {
		db.prepare(
			`UPDATE study_records
			 SET title = @title,
			     subject = @subject,
			     duration_minutes = @durationMinutes,
			     date = @date,
			     completed = @completed,
			     notes = @notes,
			     updated_at = @updatedAt
			 WHERE id = @id AND user_id = @userId`
		).run({
			id,
			userId,
			title: input.title,
			subject: input.subject,
			durationMinutes: input.durationMinutes,
			date: input.date,
			completed: Number(input.completed),
			notes: input.notes,
			updatedAt: timestamp
		});
		return;
	}

	db.prepare(
		`INSERT INTO study_records (
			id, user_id, title, subject, duration_minutes, date, completed, notes, created_at, updated_at
		) VALUES (
			@id, @userId, @title, @subject, @durationMinutes, @date, @completed, @notes, @createdAt, @updatedAt
		)`
	).run({
		id: randomUUID(),
		userId,
		title: input.title,
		subject: input.subject,
		durationMinutes: input.durationMinutes,
		date: input.date,
		completed: Number(input.completed),
		notes: input.notes,
		createdAt: timestamp,
		updatedAt: timestamp
	});
}

export function toggleStudyRecord(userId: string, id: string) {
	const record = db
		.prepare('SELECT completed FROM study_records WHERE id = ? AND user_id = ?')
		.get(id, userId) as { completed: number } | undefined;

	if (!record) return;

	db.prepare(
		`UPDATE study_records
		 SET completed = ?, updated_at = ?
		 WHERE id = ? AND user_id = ?`
	).run(record.completed ? 0 : 1, new Date().toISOString(), id, userId);
}

export function deleteStudyRecord(userId: string, id: string) {
	db.prepare('DELETE FROM study_records WHERE id = ? AND user_id = ?').run(id, userId);
}

export function resetStudyRecordsForUser(userId: string) {
	const transaction = db.transaction(() => {
		db.prepare('DELETE FROM study_records WHERE user_id = ?').run(userId);
		const insert = db.prepare(
			`INSERT INTO study_records (
				id, user_id, title, subject, duration_minutes, date, completed, notes, created_at, updated_at
			) VALUES (
				@id, @userId, @title, @subject, @durationMinutes, @date, @completed, @notes, @createdAt, @updatedAt
			)`
		);

		for (const record of sampleStudyRecords) {
			insert.run({
				id: randomUUID(),
				userId,
				title: record.title,
				subject: record.subject,
				durationMinutes: record.durationMinutes,
				date: record.date,
				completed: Number(record.completed),
				notes: record.notes,
				createdAt: record.createdAt,
				updatedAt: record.updatedAt
			});
		}
	});

	transaction();
}

function getValue(formData: FormData, key: string) {
	const raw = formData.get(key);
	return typeof raw === 'string' ? raw.trim() : '';
}

export function formDataToValues(formData: FormData): RecordFormValues {
	return {
		id: getValue(formData, 'id') || undefined,
		title: getValue(formData, 'title'),
		subject: getValue(formData, 'subject'),
		durationMinutes: getValue(formData, 'durationMinutes'),
		date: getValue(formData, 'date'),
		completed: formData.get('completed') === 'on',
		notes: getValue(formData, 'notes')
	};
}

export function validateStudyRecord(values: RecordFormValues) {
	const errors: RecordFormErrors = {};
	const duration = Number(values.durationMinutes);
	const selectedDate = values.date ? new Date(`${values.date}T00:00:00`) : null;
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	if (!values.title) errors.title = 'Task title is required.';
	if (!values.subject) errors.subject = 'Subject is required.';

	if (!values.date) {
		errors.date = 'Study date is required.';
	} else if (selectedDate && selectedDate > today) {
		errors.date = 'Study date cannot be in the future.';
	}

	if (!Number.isFinite(duration) || duration <= 0) {
		errors.durationMinutes = 'Duration must be a positive number of minutes.';
	}

	if (values.notes.length > 400) {
		errors.notes = 'Notes should stay under 400 characters.';
	}

	if (Object.keys(errors).length > 0) {
		return { valid: false as const, errors };
	}

	return {
		valid: true as const,
		data: {
			title: values.title,
			subject: values.subject,
			durationMinutes: duration,
			date: values.date,
			completed: values.completed,
			notes: values.notes
		} satisfies StudyRecordInput
	};
}
