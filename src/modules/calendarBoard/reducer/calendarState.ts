import { sampleEventLinks } from '@/data/sampleEventLinks'
import { sampleEvents } from '@/data/sampleEvents'
import type { CalendarEvent, eventLink } from '@/types/calendar-types'
import { atom } from 'nanostores'

export const calendarState = atom({
	events: [...sampleEvents],
	eventLinks: [...sampleEventLinks],
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
export const linksHandler = (link: eventLink, toDelete = false) => {
	let currentState = getCalendarState()

	let LinkIndex = currentState.eventLinks.findIndex((l: eventLink) => l.id === link.id)
	let links = [...currentState.eventLinks]
	if (toDelete) {
		links = links.filter((l: eventLink) => l.id != link.id)
	} else {
		LinkIndex >= 0 ? (links[LinkIndex] = { ...links[LinkIndex], ...link }) : links.push({ ...link })
	}

	setCalendarState({ links: links })
}
