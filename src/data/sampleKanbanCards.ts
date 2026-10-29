import type { KanbanCard } from '@/types/kanban-types'
import type { KanbanColumn as KanbanColumnType } from '@/types/kanban-types'

export const sampleKanbanCards: KanbanCard[] = [
	{ id: 'k1', title: 'Research competitor pricing', type: 'task', createdAt: new Date() },
	{ id: 'k2', title: 'New onboarding flow', type: 'idea', createdAt: new Date() },
	{ id: 'k3', title: 'API performance metrics', type: 'data', createdAt: new Date() },
	{ id: 'k4', title: 'Design homepage mockup', type: 'task', createdAt: new Date() },
	{ id: 'k5', title: 'API integration research', type: 'idea', createdAt: new Date() },
	{ id: 'k6', title: 'User feedback analysis', type: 'data', createdAt: new Date() }
]

export const initialColumns: KanbanColumnType[] = [
	{
		id: 'backlog',
		title: 'Backlog',
		cards: [
			{
				id: '1',
				title: 'Research competitor pricing',
				description: 'Analyze pricing strategies of top 5 competitors',
				type: 'task',
				createdAt: new Date(),
				tags: ['research', 'priority']
			},
			{
				id: '2',
				title: 'Meeting notes - Q1 Planning',
				description: 'Key decisions from the quarterly planning session',
				type: 'note',
				createdAt: new Date(),
				tags: ['meeting']
			}
		]
	},
	{
		id: 'in-progress',
		title: 'In Progress',
		cards: [
			{
				id: '3',
				title: 'New onboarding flow',
				description: 'Redesign the user onboarding experience with interactive tutorials',
				type: 'idea',
				createdAt: new Date(),
				tags: ['ux', 'feature']
			}
		]
	},
	{
		id: 'review',
		title: 'Review',
		cards: [
			{
				id: '4',
				title: 'API performance metrics',
				description: 'Response times and error rates for the past 30 days',
				type: 'data',
				createdAt: new Date(),
				tags: ['metrics']
			}
		]
	},
	{
		id: 'done',
		title: 'Done',
		cards: []
	}
]
