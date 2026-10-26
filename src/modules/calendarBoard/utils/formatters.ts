import { monthNames } from 'src/data/monthNames'
import { getWeekDays } from './calendarDates'

const formatShortDate = (date: Date) => {
	return date.toLocaleDateString('en-US', {
		day: 'numeric'
	})
}
const formatDateHeader = (currentDate: Date, view?: 'month' | 'week' | 'day', month?: number, year?: number) => {
	if (view === 'month') {
		return `${monthNames[month!]} ${year}`
	} else if (view === 'week') {
		const weekDays = getWeekDays(currentDate)
		return `from ${formatShortDate(weekDays[0])} to ${formatShortDate(weekDays[weekDays.length - 1])}`
	} else {
		return currentDate.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		})
	}
}
export { formatDateHeader, formatShortDate }
