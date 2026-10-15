import { type KanbanCard } from './kanban-types'
import { type Project } from './project-types'

export const initialEntries: TimeEntry[] = [
	{
		id: '1',
		title: 'Team standup meeting',
		description: 'Daily sync with the development team',
		date: new Date('2026-10-13'),
		startTime: '09:00',
		endTime: '09:30',
		projectId: 'proj-1',
		tags: ['meeting', 'team'],
		createdAt: new Date()
	},
	{
		id: '2',
		title: 'Homepage design work',
		description: 'Working on the hero section and navigation',
		date: new Date('2026-10-15'),
		startTime: '09:45',
		endTime: '12:00',
		projectId: 'proj-1',
		kanbanCardId: 'card-1',
		tags: ['design', 'deep work'],
		createdAt: new Date()
	},
	{
		id: '3',
		title: 'Lunch break',
		date: new Date('2026-10-13'),
		startTime: '12:00',
		endTime: '13:00',
		tags: ['break'],
		createdAt: new Date()
	},
	{
		id: '4',
		title: 'Client call',
		description: 'Discussing project requirements and timeline',
		date: new Date('2026-10-13'),
		startTime: '14:00',
		endTime: '15:00',
		projectId: 'proj-2',
		tags: ['meeting', 'client', 'billable'],
		createdAt: new Date()
	},
	{
		id: '5',
		title: 'Code review and documentation',
		date: new Date('2026-10-12'),
		startTime: '10:00',
		endTime: '11:30',
		projectId: 'proj-1',
		tags: ['review', 'docs'],
		createdAt: new Date()
	},
	{
		id: '6',
		title: 'example entry log',
		date: new Date('2026-10-13'),
		startTime: '10:00',
		endTime: '11:30',
		projectId: 'proj-1',
		tags: ['review', 'docs'],
		createdAt: new Date()
	}
]

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
	updatedAt?: Date 
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
