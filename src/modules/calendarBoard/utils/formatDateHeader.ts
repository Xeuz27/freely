import { monthNames } from '@/data/monthNames'

export const formatDateHeader = (view: 'month' | 'week' | 'day', currentDate: Date, month: number, year: number) => {
	if (view === 'day') {
		return currentDate.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		})
	}
	/* @ts-ignore */
	return `${monthNames[month]} ${year}`
}
