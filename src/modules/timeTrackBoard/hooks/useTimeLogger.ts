import usePersist from 'src/modules/core/hooks/usePersist'
import { useStore } from '@nanostores/react'
import { setState, state } from 'src/store/timeTrack'
import type { TimeEntry } from 'src/types/timetrack-types'
import { isSameDay } from 'src/modules/calendarBoard/utils/eventQueries'

const useTimeLogger = () => {
	const $Store = useStore(state)
	const { entries } = $Store

	usePersist('entries', entries, (persistedEntries: TimeEntry[]) => {
		setState({
			entries: persistedEntries.map((entry) => ({
				...entry,
				createdAt: new Date(entry.createdAt),
				date: new Date(entry.date)
			}))
		})
	})

	const getEntriesForDate = (date: Date) => entries.filter((entry) => isSameDay(entry.date, date))

	return {
		entries,
		getEntriesForDate
	}
}
export default useTimeLogger
