import { useContext } from 'react'
import { CalendarContext } from '../context/calendarContext'

const useCalendarContext = () => {
	const context = useContext(CalendarContext)
	if (!context) {
		throw new Error('useCalendarContext must be used within calendarContextProvider')
	}
	return context
}

export default useCalendarContext
