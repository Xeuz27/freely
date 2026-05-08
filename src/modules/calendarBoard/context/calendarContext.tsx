import type { CalendarEvent } from '@/types/calendar-types'
import { createContext, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import useCalendar from '../hooks/useCalendar'

type CalendarContext = {
	currentDate: Date
	setCurrentDate: Dispatch<SetStateAction<Date>>
	days: (Date | null)[]
	today: Date
	month: number
	year: number

	dialogOpen: boolean
	setDialogOpen: Dispatch<SetStateAction<boolean>>

	editingEvent: CalendarEvent | undefined
	setEditingEvent: Dispatch<SetStateAction<CalendarEvent | undefined>>
	// events: CalendarEvent[]
	// setEvents: Dispatch<SetStateAction<CalendarEvent[]>>
	selectedDate: Date | undefined
	setSelectedDate: Dispatch<SetStateAction<Date | undefined>>
	selectedTime: string | undefined
	setSelectedTime: Dispatch<SetStateAction<string | undefined>>

	view: 'month' | 'week' | 'day'
	setView: Dispatch<SetStateAction<'month' | 'week' | 'day'>>

	getEventsForDate: (date: Date) => CalendarEvent[]
	getTodayEvents: CalendarEvent[]
	getWeekDays: Date[]
}
type props = {
	children: ReactNode
}

export const CalendarContext = createContext<CalendarContext | null>(null)

const CalendarContextProvider = ({ children }: props) => {
	const values = useCalendar()

	return <CalendarContext.Provider value={values}>{children}</CalendarContext.Provider>
}

export default CalendarContextProvider
