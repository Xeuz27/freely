import { useMemo } from 'react'
import { buildMonthEvents } from '../utils/eventQueries'
import useCalendarContext from './useCalendarContext'

const useMonthEvents = () => {
	const { days, getEventsForDate } = useCalendarContext()
	return useMemo(() => {
		return buildMonthEvents(days, getEventsForDate)
	}, [days, getEventsForDate])
}

export default useMonthEvents
