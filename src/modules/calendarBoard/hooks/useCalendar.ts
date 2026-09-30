import type { CalendarEvent } from '@/types/calendar-types'
import { useMemo, useState } from 'react'
import { getMonthDays } from '../utils/calendarDates'
import useCalendarEvents from './useCalendarEvents'

const useCalendar = () => {
	const { getEventsForDate, getTodayEvents } = useCalendarEvents()

	const [currentDate, setCurrentDate] = useState(new Date())
	const today = new Date()
	const year = currentDate.getFullYear()
	const month = currentDate.getMonth()

	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
	const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
	const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(undefined)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [view, setView] = useState<'month' | 'week' | 'day'>('month')
	const days = useMemo(() => getMonthDays(year, month), [year, month])

	return {
		currentDate,
		setCurrentDate,
		days,
		today,
		month,
		year,

		dialogOpen,
		setDialogOpen,

		editingEvent,
		setEditingEvent,

		selectedDate,
		setSelectedDate,
		selectedTime,
		setSelectedTime,

		view,
		setView,

		getEventsForDate,
		getTodayEvents
	}
}

export default useCalendar
