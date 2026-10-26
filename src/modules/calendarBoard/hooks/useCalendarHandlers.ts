import type { CalendarEvent } from '@/types/calendar-types'
import useCalendarContext from './useCalendarContext'
import { handleDeleteEvent, handleSaveEvent } from '../utils/handlers'

const useCalendarHandlers = () => {
	const {
		view,
		year,
		month,
		currentDate,
		setCurrentDate,
		setEditingEvent,
		setSelectedDate,
		setSelectedTime,
		setDialogOpen
	} = useCalendarContext()

	const handlePrev = () => {
		if (view === 'month') {
			setCurrentDate(new Date(year, month - 1, 1))
			return
		}

		const newDate = new Date(currentDate)
		newDate.setDate(newDate.getDate() - (view === 'week' ? 7 : 1))
		setCurrentDate(newDate)
	}

	const handleNext = () => {
		if (view === 'month') {
			setCurrentDate(new Date(year, month + 1, 1))
			return
		}

		const newDate = new Date(currentDate)
		newDate.setDate(newDate.getDate() + (view === 'week' ? 7 : 1))
		setCurrentDate(newDate)
	}

	const handleAddEvent = (date?: Date, time?: string) => {
		setEditingEvent(undefined)
		setSelectedDate(date)
		setSelectedTime(time)
		setDialogOpen(true)
	}

	const handleEditEvent = (event: CalendarEvent) => {
		setEditingEvent(event)
		setSelectedDate(undefined)
		setSelectedTime(undefined)
		setDialogOpen(true)
	}

	return {
		handleAddEvent,
		handleDeleteEvent,
		handleEditEvent,
		handleNext,
		handlePrev,
		handleSaveEvent
	}
}

export default useCalendarHandlers
