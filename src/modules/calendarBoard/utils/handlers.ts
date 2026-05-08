import { eventHandler, linksHandler } from '@/store/store'
import type { CalendarEvent } from '@/types/calendar-types'
import type { Dispatch, SetStateAction } from 'react'
import { type eventLink } from './../../../types/calendar-types'

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
const handleSaveEventLink = (eventLink: Partial<eventLink>) => {
	let link = eventLink
	if (!eventLink.id) {
		link = {
			...eventLink,
			id: crypto.randomUUID().split('-')[0]
		}
	}
	linksHandler({ link: link as eventLink  })
	return link
}
type eventData = Partial<CalendarEvent>
const handleSaveEvent = (eventData: eventData) => {
	let event = eventData
	if (!eventData.id) {
		event = {
			...eventData,
			id: crypto.randomUUID().split('-')[0],
			createdAt: new Date()
		}
	}else {
		event ={...eventData,
			updatedAt: new Date()
		}
	}
	eventHandler(event as CalendarEvent)
	return event as CalendarEvent
}

export { handleAddEvent, handleDeleteEvent, handleEditEvent, handleNext, handlePrev, handleSaveEvent, handleSaveEventLink }
