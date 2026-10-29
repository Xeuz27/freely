import type { TimeEntry } from 'src/types/timetrack-types'
import { entriesHandler } from 'src/store/timeTrack'
import useTimetrackContext from './useTimeTrackContext'
import useProjectContext from 'src/modules/projectBoard/hooks/useProjectsContext'
import useKanbanContext from 'src/modules/kanbanBoard/hooks/useKanbanContext'

const useHandlers = () => {
	const {
		setDialogOpen,
		setEditEntry,
		setInitialStartTime,
		setInitialEndTime,
		currentDate,
		viewMode,
		setCurrentDate
	} = useTimetrackContext()
	const { projects } = useProjectContext()
	const { kanbanCards } = useKanbanContext()

	const navigateDate = (direction: 'prev' | 'next') => {
		const newDate = new Date(currentDate)
		if (viewMode === 'day') {
			newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
		} else {
			newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
		}
		setCurrentDate(newDate)
	}

	const handleAddEntry = (startTime?: string, endTime?: string) => {
		setInitialStartTime(startTime)
		setInitialEndTime(endTime)
		setDialogOpen(true)
	}

	const handleEditEntry = (entry: TimeEntry) => {
		setEditEntry(entry)
		setInitialStartTime(undefined)
		setInitialEndTime(undefined)
		setDialogOpen(true)
	}

	const handleDeleteEntry = (entry: TimeEntry) => {
		entriesHandler(entry, true)
	}

	const handleSaveEntry = (entryData: Partial<TimeEntry>) => {
		let entry
		if (entryData.id) {
			entry = { ...entryData, updatedAt: new Date() }
		} else {
			entry = {
				...entryData,
				id: crypto.randomUUID().split('-')[0],
				createdAt: new Date()
			}
		}
		entriesHandler(entry as TimeEntry)
	}

	const goToToday = () => {
		setCurrentDate(new Date())
	}

	const getProjectById = (id?: string) => projects.find((p) => p.id === id)
	const getKanbanCardById = (id?: string) => kanbanCards.find((c) => c.id === id)

	return {
		navigateDate,
		handleAddEntry,
		handleDeleteEntry,
		handleEditEntry,
		handleSaveEntry,
		goToToday,
		getProjectById,
		getKanbanCardById
	}
}
export default useHandlers
