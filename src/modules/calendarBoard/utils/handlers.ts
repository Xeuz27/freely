import type { CalendarEvent } from '@/types/calendar-types'
import type { Dispatch, SetStateAction } from 'react'
import { eventHandler } from '../reducer/calendarState'

const handlePrev = (view: string, year: number, month: number, currentDate: Date, setCurrentDate: Dispatch<SetStateAction<Date>>) => {
	if (view === 'month') {
		setCurrentDate(new Date(year, month - 1, 1))
	} else if (view === 'week') {
		const newDate = new Date(currentDate)
		newDate.setDate(newDate.getDate() - 7)
		setCurrentDate(newDate)
	} else {
		const newDate = new Date(currentDate)
		newDate.setDate(newDate.getDate() - 1)
		setCurrentDate(newDate)
	}
}

const handleNext = (view: any, currentDate: any, setCurrentDate: any, year: any, month: any) => {
	if (view === 'month') {
		setCurrentDate(new Date(year, month + 1, 1))
	} else if (view === 'week') {
		const newDate = new Date(currentDate)
		newDate.setDate(newDate.getDate() + 7)
		setCurrentDate(newDate)
	} else {
		const newDate = new Date(currentDate)
		newDate.setDate(newDate.getDate() + 1)
		setCurrentDate(newDate)
	}
}

const handleAddEvent = (date?: Date, time?: string, setEditingEvent?: any, setSelectedDate?: any, setSelectedTime?: any, setDialogOpen?: any) => {
	setEditingEvent(null)
	setSelectedDate(date || null)
	setSelectedTime(time)
	setDialogOpen(true)
}

const handleEditEvent = (event: CalendarEvent, setEditingEvent?: any, setSelectedDate?: any, setSelectedTime?: any, setDialogOpen?: any) => {
	setEditingEvent(event)
	setSelectedDate(null)
	setSelectedTime(undefined)
	setDialogOpen(true)
}

const handleDeleteEvent = (event: CalendarEvent) => {
	eventHandler(event, true)
}

type eventData = Omit<CalendarEvent, 'id' | 'createdAt'> & { id?: string }

const handleSaveEvent = (eventData: eventData, setEditingEvent: any, setSelectedDate: any, setSelectedTime: any) => {
	if (eventData.id) {
		//@ts-ignore
		eventHandler(eventData)
	} else {
		const newEvent: CalendarEvent = {
			...eventData,
			id: crypto.randomUUID().split('-')[0],
			createdAt: new Date()
		}
		eventHandler(newEvent)
	}
	setEditingEvent(null)
	setSelectedDate(null)
	setSelectedTime(undefined)
}

export { handleAddEvent, handleDeleteEvent, handleEditEvent, handleNext, handlePrev, handleSaveEvent }
