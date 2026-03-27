export type CardType = 'task' | 'note' | 'idea' | 'data' | 'lead'

export interface KanbanCard {
	id: string
	title: string
	description?: string
	type: CardType
	createdAt: Date
	tags?: string[]
}

export interface KanbanColumn {
	id: string
	title: string
	cards: KanbanCard[]
}

export const cardTypeColors: Record<CardType, { bg: string; text: string; border: string }> = {
	task: {
		bg: 'bg-emerald-500/10',
		text: 'text-emerald-400',
		border: 'border-emerald-500/30'
	},
	note: {
		bg: 'bg-blue-500/10',
		text: 'text-blue-400',
		border: 'border-blue-500/30'
	},
	idea: {
		bg: 'bg-amber-500/10',
		text: 'text-amber-400',
		border: 'border-amber-500/30'
	},
	data: {
		bg: 'bg-pink-500/10',
		text: 'text-pink-400',
		border: 'border-pink-500/30'
	},
	lead: {
		bg: 'bg-teal-500/10',
		text: 'text-teal-400',
		border: 'border-teal-500/30'
	}
}

export const cardTypeIcons: Record<CardType, string> = {
	task: 'CheckSquare',
	note: 'FileText',
	idea: 'Lightbulb',
	data: 'Database',
	lead: 'UserRoundPlus'
}
