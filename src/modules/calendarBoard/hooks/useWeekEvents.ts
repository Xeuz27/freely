import { useMemo } from 'react'
import { getWeekDays } from '../utils/calendarDates'
import { buildEventsDayHour, buildEventsHourDay } from '../utils/eventQueries'
import useCalendarContext from './useCalendarContext'

export const useWeekEvents = (currentDate: Date) => {
	const { getEventsForDate } = useCalendarContext()
	const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate])

	const eventsDayHour = useMemo(() => buildEventsDayHour(weekDays, getEventsForDate), [weekDays, getEventsForDate])

	const eventsHourDay = useMemo(() => {
		return buildEventsHourDay(weekDays, eventsDayHour)
	}, [weekDays, eventsDayHour])

	return {
		weekDays,
		eventsDayHour,
		eventsHourDay
	}
}
