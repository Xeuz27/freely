import type { TimeEntry } from '@/types/timetrack-types'
import type { KanbanCard } from '@/types/kanban-types'
import type { Project } from '@/types/project-types'
import useTimetracker from '../hooks/useTimetracker'
import { createContext } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

type TimetrackContext = {
	entries: TimeEntry[]
	setEntries: (entries: TimeEntry[]) => void
	currentDate: Date
	setCurrentDate: Dispatch<SetStateAction<Date>>
	dialogOpen: boolean
	setDialogOpen: Dispatch<SetStateAction<boolean>>
	editEntry: TimeEntry | null
	setEditEntry: Dispatch<SetStateAction<TimeEntry | null>>
	initialStartTime: string | undefined
	setInitialStartTime: Dispatch<SetStateAction<string | undefined>>
	initialEndTime: string | undefined
	setInitialEndTime: Dispatch<SetStateAction<string | undefined>>
	viewMode: 'day' | 'week'
	setViewMode: Dispatch<SetStateAction<'day' | 'week'>>
	projects: Project[]
	kanbanCards: KanbanCard[]
	isSameDay: (a: Date, b: Date) => boolean
	isToday: (date: Date) => boolean
	getWeekDates: Date[]
	todayEntries: TimeEntry[]
	todayTotalMinutes: number
	weekTotalMinutes: number
	handleAddEntry: (startTime?: string | undefined, endTime?: string | undefined) => void
	handleEditEntry: (entry: TimeEntry) => void
	handleDeleteEntry: (id: string) => void
	handleSaveEntry: (entryData: Omit<TimeEntry, 'id' | 'createdAt'> & { id?: string }) => void
	navigateDate: (direction: 'prev' | 'next') => void
	goToToday: () => void
	formatDateHeader: (date: Date) => string
	formatShortDate: (date: Date) => string
	getProjectById: (id?: string) => Project | undefined
	getKanbanCardById: (id?: string) => KanbanCard | undefined
}
type props = {
	children: ReactNode
}

export const TimetrackContext = createContext<TimetrackContext | null>(null)

const TimetrackContextProvider = ({ children }: props) => {
	const values = useTimetracker()

	return <TimetrackContext.Provider value={values}>{children}</TimetrackContext.Provider>
}

export default TimetrackContextProvider
