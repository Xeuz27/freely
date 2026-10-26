import type { TimeEntry } from '@/types/timetrack-types'
import type { KanbanCard } from '@/types/kanban-types'
import type { Project } from '@/types/project-types'
import useTimetracker from '../hooks/useTimetracker'
import { createContext } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

type TimetrackContext = {
	initialDate: Date
	setInitialDate: Dispatch<SetStateAction<Date>>
	entries: TimeEntry[]
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
	getWeekDates: Date[]
	todayTotalMinutes: number
	weekTotalMinutes: number
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
