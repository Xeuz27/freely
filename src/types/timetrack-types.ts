import { type KanbanCard } from './kanban-types'
import { type Project } from './project-types'

export interface TimeEntry {
	id: string
	title: string
	description?: string
	date: Date
	startTime: string
	endTime: string
	projectId?: string
	kanbanCardId?: string
	tags?: string[]
	createdAt: Date
}

export interface TimeEntryWithLinks extends TimeEntry {
	project?: Project
	kanbanCard?: KanbanCard
}

export function calculateDuration(startTime: string, endTime: string): number {
	const [startHour, startMin] = startTime.split(':').map(Number)
	const [endHour, endMin] = endTime.split(':').map(Number)
	const startMinutes = startHour * 60 + startMin
	const endMinutes = endHour * 60 + endMin
	return Math.max(0, endMinutes - startMinutes)
}

export function formatDuration(minutes: number): string {
	const hours = Math.floor(minutes / 60)
	const mins = minutes % 60
	if (hours === 0) return `${mins}m`
	if (mins === 0) return `${hours}h`
	return `${hours}h ${mins}m`
}

export function formatTimeRange(startTime: string, endTime: string): string {
	return `${startTime} - ${endTime}`
}
