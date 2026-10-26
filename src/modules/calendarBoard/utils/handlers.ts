import { eventHandler, linksHandler } from '@/store/store'
import type { CalendarEvent } from '@/types/calendar-types'
import { type eventLink } from './../../../types/calendar-types'
//abstraer todo a useCalendarHandlers??
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
	linksHandler({ link: link as eventLink })
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
	} else {
		event = { ...eventData, updatedAt: new Date() }
	}
	eventHandler(event as CalendarEvent)
	return event as CalendarEvent
}

export { handleDeleteEvent, handleSaveEvent, handleSaveEventLink }
