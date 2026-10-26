import { useState, useMemo } from 'react'
import { sampleKanbanCards as kanbanCards } from '@/data/sampleKanbanCards'
import { type TimeEntry, calculateDuration } from '@/types/timetrack-types'
import useTimeLogger from './useTimeLogger'
import { sampleProjects as projects } from '@/data/sampleProjects'

const useTimeTracker = () => {
	const { getEntriesForDate, entries } = useTimeLogger()
	const [currentDate, setCurrentDate] = useState(new Date())

	const today = new Date()
	const yesterday = new Date(today)
	yesterday.setDate(yesterday.getDate() - 1)

	const [initialDate, setInitialDate] = useState(new Date())
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editEntry, setEditEntry] = useState<TimeEntry | null>(null)
	const [initialStartTime, setInitialStartTime] = useState<string | undefined>()
	const [initialEndTime, setInitialEndTime] = useState<string | undefined>()
	const [viewMode, setViewMode] = useState<'day' | 'week'>('day')

	const getWeekDates = useMemo(() => {
		const dates: Date[] = []
		const start = new Date(currentDate)
		start.setDate(start.getDate() - start.getDay())
		for (let i = 0; i < 7; i++) {
			const d = new Date(start)
			d.setDate(start.getDate() + i)
			dates.push(d)
		}
		return dates
	}, [currentDate])

	const todayTotalMinutes = getEntriesForDate(currentDate).reduce(
		(acc, e) => acc + calculateDuration(e.startTime, e.endTime),
		0
	)

	const weekTotalMinutes = useMemo(() => {
		return getWeekDates.reduce((acc, date) => {
			const dayEntries = getEntriesForDate(date)
			return (
				acc +
				dayEntries.reduce((dayAcc, e) => {
					return dayAcc + calculateDuration(e.startTime, e.endTime)
				}, 0)
			)
		}, 0)
	}, [getEntriesForDate, getWeekDates])

	return {
		initialDate,
		setInitialDate,
		entries,
		currentDate,
		setCurrentDate,
		dialogOpen,
		setDialogOpen,
		editEntry,
		setEditEntry,
		initialStartTime,
		setInitialStartTime,
		initialEndTime,
		setInitialEndTime,
		viewMode,
		setViewMode,
		projects,
		kanbanCards,
		getWeekDates,
		todayTotalMinutes,
		weekTotalMinutes
	}
}
export default useTimeTracker
