export function getLocalDateKey(date = new Date()) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function formatMinutes(minutes: number) {
	if (!minutes) return '0h';

	const hours = minutes / 60;
	if (hours >= 1) return `${hours.toFixed(1)}h`;
	return `${minutes} min`;
}

export function formatDateLabel(date: string) {
	return new Intl.DateTimeFormat('en-NZ', {
		month: 'short',
		day: 'numeric'
	}).format(new Date(`${date}T00:00:00`));
}

export function formatLongDate(date: string) {
	return new Intl.DateTimeFormat('en-NZ', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}).format(new Date(`${date}T00:00:00`));
}

export function toPercentage(value: number) {
	return `${Math.round(value)}%`;
}
