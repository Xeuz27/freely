import { sampleEventLinks } from '@/data/sampleEventLinks'
import { sampleEvents } from '@/data/sampleEvents'
import { sampleLeads } from '@/data/sampleLeads'
import type { CalendarEvent, linkHandlerParams } from '@/types/calendar-types'
import type { Lead } from '@/types/crm-types'
import { atom } from 'nanostores'

export const removeByPredicate = <T>(list: T[], predicate: (item: T) => boolean) =>
	list.filter((item) => !predicate(item))

export const state = atom({
	events: [...sampleEvents],
	eventLinks: [...sampleEventLinks],
	leads: [...sampleLeads]
})

export const getState = () => {
	return state.get()
}
export const setState = (value: object) => {
	const currentState = getState()
	state.set({ ...currentState, ...value })
}

export const eventHandler = (event: CalendarEvent, toDelete = false) => {
	const currentState = getState()
	let events = [...currentState.events]
	const eventIndex = events.findIndex((ev) => ev.id === event.id)

	if (toDelete) {
		events = removeByPredicate(events, (ev) => ev.id === event.id)
		linksHandler({ id: event.id, key: 'eventId' })
	} else {
		if (eventIndex >= 0) {
			events[eventIndex] = {
				...events[eventIndex],
				...event,
				updatedAt: new Date()
			}
		} else {
			events.push({ ...event })
		}
	}
	setState({ events: events })
}

export function linksHandler(params: linkHandlerParams) {
	const currentState = getState()
	let links = [...currentState.eventLinks]
	let LinkIndex: number

	if ('id' in params) {
		const { id, key } = params
		links = removeByPredicate(links, (link) => link[key] === id)
	} else {
		const { link, toDelete = false } = params

		if (toDelete) {
			links = removeByPredicate(links, (l) => l.id === link.id)
		} else {
			LinkIndex = links.findIndex((l) => l.id === link.id)
			if (LinkIndex >= 0) {
				links[LinkIndex] = { ...links[LinkIndex], ...link }
			} else {
				links.push({ ...link })
			}
		}
	}
	setState({ eventLinks: links })
}

export const leadsHandler = (lead: Lead, toDelete = false) => {
	const currentState = getState()
	let leads = [...currentState.leads]
	const leadIndex = leads.findIndex((l) => l.id === lead.id)

	if (toDelete) {
		leads = removeByPredicate(leads, (l) => l.id === lead.id)
		linksHandler({ id: lead.id, key: 'leadId' })
	} else {
		if (leadIndex >= 0) {
			leads[leadIndex] = {
				...leads[leadIndex],
				...lead,
				updatedAt: new Date()
			}
		} else {
			leads.push({ ...lead })
		}
	}

	setState({ leads: leads })
}
