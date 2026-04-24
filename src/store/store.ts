import { sampleEventLinks } from '@/data/sampleEventLinks'
import { sampleEvents } from '@/data/sampleEvents'
import { sampleLeads } from '@/data/sampleLeads'
import type {
	CalendarEvent,
	eventLink,
	linkHandlerParams
} from '@/types/calendar-types'
import type { Lead } from '@/types/crm-types'
import { atom } from 'nanostores'

const removeByPredicate = (list: eventLink[] | Lead[], predicate: (l: eventLink | Lead) => boolean ) => list.filter((l) => !predicate(l))

export const state = atom({
	events: [...sampleEvents],
	eventLinks: [...sampleEventLinks],
	leads: [...sampleLeads]
})

export const getState = () => {
	return state.get()
}
export const setState = (value: Object) => {
	let currentState = getState()
	state.set({ ...currentState, ...value })
}

export const eventHandler = (event: CalendarEvent, toDelete = false) => {
	let currentState = getState()
	let events = [...currentState.events]
	let eventIndex = events.findIndex((ev) => ev.id === event.id)

	if (toDelete) {
		//@ts-ignore
		events = removeByPredicate(events, (ev) => ev.id === event.id)
		linksHandler({ id: event.id, key: 'eventId' })
	} else {
		eventIndex >= 0
			? (events[eventIndex] = {
					...events[eventIndex],
					...event,
					updatedAt: new Date()
			  })
			: events.push({ ...event })
	}
	setState({ events: events })
}

export function linksHandler(params: linkHandlerParams) {
	let currentState = getState()
	let links = [...currentState.eventLinks]
	let LinkIndex: number

	if ('id' in params) {
		const { id, key } = params
		//@ts-ignore
		links = removeByPredicate(links, (link) => link[key] === id)
	} else {
		const { link, toDelete = false } = params

		if (toDelete) {
			//@ts-ignore
			links = removeByPredicate(links, (l) => l.id === link.id)
		} else {
			LinkIndex = links.findIndex((l) => l.id === link.id)
			LinkIndex >= 0
				? (links[LinkIndex] = { ...links[LinkIndex], ...link })
				: links.push({ ...link })
		}
	}
	setState({ eventLinks: links })
}

export const leadsHandler = (lead: Lead, toDelete = false) => {
	let currentState = getState()
	let leads = [...currentState.leads]
	let leadIndex = leads.findIndex((l) => l.id === lead.id)

	if (toDelete) {
		//@ts-ignore
		leads = removeByPredicate(leads, (l) => l.id === lead.id)
		linksHandler({ id: lead.id, key: 'leadId' })
	} else {
		leadIndex >= 0
			? (leads[leadIndex] = {
					...leads[leadIndex],
					...lead,
					updatedAt: new Date()
			  })
			: leads.push({ ...lead })
	}

	setState({ leads: leads })
}
