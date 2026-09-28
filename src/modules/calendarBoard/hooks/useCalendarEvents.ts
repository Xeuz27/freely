import { setState, state } from '@/store/store'
import { useStore } from '@nanostores/react'
import { useCallback, useMemo } from 'react'
import { getEventsForDate as getEventsForDateQuery, sortEventsByStartTime } from '../utils/eventQueries'
import usePersist from '@/modules/core/hooks/usePersist'
import type { CalendarEvent, eventLink } from '@/types/calendar-types'

const useCalendarEvents = () => {
	const $Store = useStore(state)
	const { events, eventLinks } = $Store

	usePersist('events', events, (persistedEvents: CalendarEvent[]) => {
		setState({
			events: persistedEvents.map((event) => ({
				...event,
				createdAt: new Date(event.createdAt),
				date: new Date(event.date)
			}))
		})
	})

	usePersist('eventLinks', eventLinks, (values: eventLink[]) => {
		setState({ eventLinks: values })
	})

	const getEventsForDate = useCallback((date: Date) => getEventsForDateQuery(events, date), [events])

	const getTodayEvents = useMemo(() => sortEventsByStartTime(getEventsForDateQuery(events, new Date())), [events])

	return {
		events,
		eventLinks,
		getEventsForDate,
		getTodayEvents
	}
}

export default useCalendarEvents
