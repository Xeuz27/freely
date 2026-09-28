import type { CalendarEvent } from '@/types/calendar-types'
import { format } from '@formkit/tempo'
import { useEffect, useMemo, useState } from 'react'
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
	const [range, setRange] = useState([])
	const days = useMemo(() => getMonthDays(year, month), [year, month])

	let rangeEventsMap = new Map()

	// let range = days.filter((day) => day !== null).map((day) => format(day, 'YYYY-MM-DD'))
	useEffect(() => {
		// console.log('r')
		days.filter((day) => day !== null).map((day) => {
			let dayFormat = format(day, 'YYYY-MM-DD')
			//@ts-ignore
			if (rangeEventsMap.has(dayFormat)) {
				console.log('exists', dayFormat)
			} else {
				//@ts-ignore
				rangeEventsMap.set(dayFormat, { key: dayFormat })
			}
		})
		// console.log(rangeEventsMap)
	}, [days])

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
