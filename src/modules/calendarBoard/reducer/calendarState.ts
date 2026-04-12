import { sampleEvents } from '@/data/sampleEvents'
import type { CalendarEvent } from '@/types/calendar-types'
import { atom } from 'nanostores'

export const calendarState = atom({
	events: [...sampleEvents],
	editingEvent: null,
	selectedDate: null,
	selectedTime: undefined
})

export const getCalendarState = () => {
	return calendarState.get()
}
export const setCalendarState = (value: Object) => {
	let currentState = getCalendarState()
	calendarState.set({ ...currentState, ...value })
}

export const eventHandler = (event: CalendarEvent, toDelete = false) => {
	let currentState = getCalendarState()
	let eventIndex = currentState.events.findIndex((ev) => ev.id === event.id)
	let events = [...currentState.events]
	if (toDelete) {
		events = events.filter((e) => e.id != event.id)
	} else {
		eventIndex >= 0 ? (events[eventIndex] = { ...events[eventIndex], ...event }) : events.push({ ...event })
	}

	setCalendarState({ events: events })
}
