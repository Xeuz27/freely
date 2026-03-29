import { dayTimeSlots } from '@/data/dayTimeSlots'
import { sampleEvents } from '@/data/sampleEvents'
import type { CalendarEvent } from '@/types/calendar-types'
import { useMemo, useState } from 'react'

const useCalendar = () => {
	const [currentDate, setCurrentDate] = useState(new Date())
	const today = new Date()
	const year = currentDate.getFullYear()
	const month = currentDate.getMonth()

	const [events, setEvents] = useState<CalendarEvent[]>([...sampleEvents])
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
	const [selectedDate, setSelectedDate] = useState<Date | null>(null)
	const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
	const [view, setView] = useState<'month' | 'week' | 'day'>('month')

	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

	const daysInMonth = new Date(year, month + 1, 0).getDate()
	const firstDayOfMonth = new Date(year, month, 1).getDay()

	const days = useMemo(() => {
		const result: (Date | null)[] = []
		for (let i = 0; i < firstDayOfMonth; i++) {
			result.push(null)
		}
		for (let i = 1; i <= daysInMonth; i++) {
			result.push(new Date(year, month, i))
		}
		return result
	}, [year, month, daysInMonth, firstDayOfMonth])

	const getWeekDays = useMemo(() => {
		const startOfWeek = new Date(currentDate)
		const day = startOfWeek.getDay()
		startOfWeek.setDate(startOfWeek.getDate() - day)

		const weekDays: Date[] = []
		for (let i = 0; i < 7; i++) {
			weekDays.push(new Date(startOfWeek))
			startOfWeek.setDate(startOfWeek.getDate() + 1)
		}
		return weekDays
	}, [currentDate])

	const getEventsForDate = (date: Date) => {
		return events.filter(
			(event) =>
				event.date.getFullYear() === date.getFullYear() &&
				event.date.getMonth() === date.getMonth() &&
				event.date.getDate() === date.getDate()
		)
	}
	const getTodayEvents = useMemo(() => {
		return getEventsForDate(today).sort((a, b) => {
			if (!a.startTime) return 1
			if (!b.startTime) return -1
			return a.startTime.localeCompare(b.startTime)
		})
	}, [events, today])

	const formatDateHeader = () => {
		if (view === 'day') {
			return currentDate.toLocaleDateString('en-US', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
				year: 'numeric'
			})
		}
		return `${monthNames[month]} ${year}`
	}
	const getTimeSlotHeight = (startTime: string, endTime: string) => {
		const start = dayTimeSlots.indexOf(startTime)
		const end = dayTimeSlots.indexOf(endTime)
		if (start === -1 || end === -1) return 1
		return Math.max(1, end - start)
	}

	return {
		currentDate,
		days,
		dialogOpen,
		editingEvent,
		events,
		formatDateHeader,
		getEventsForDate,
		getTimeSlotHeight,
		getTodayEvents,
		getWeekDays,
		month,
		selectedDate,
		selectedTime,
		setCurrentDate,
		setDialogOpen,
		setEditingEvent,
		setEvents,
		setSelectedDate,
		setSelectedTime,
		setView,
		today,
		view,
		year
	}
}

export default useCalendar
