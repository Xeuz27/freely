export type EventType = 'meeting' | 'call' | 'task' | 'reminder' | 'deadline'

export interface CalendarEvent {
	id: string
	title: string
	description?: string
	date: Date
	startTime?: string // "09:00"
	endTime?: string // "10:00"
	type: EventType
	createdAt: Date
	updatedAt?: Date
}

export interface eventLink {
	id: string
	eventId: string
	leadId?: string
	kanbanCardId?: string
	projectId?: string
}

export const eventTypeConfig: Record<EventType, { label: string; color: string; icon: string }> = {
	meeting: {
		label: 'Meeting',
		color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
		icon: 'Users'
	},
	call: {
		label: 'Call',
		color: 'bg-green-500/20 text-green-400 border-green-500/30',
		icon: 'Phone'
	},
	task: {
		label: 'Task',
		color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
		icon: 'CheckSquare'
	},
	reminder: {
		label: 'Reminder',
		color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
		icon: 'Bell'
	},
	deadline: {
		label: 'Deadline',
		color: 'bg-red-500/20 text-red-400 border-red-500/30',
		icon: 'AlertCircle'
	}
}

export const timeSlots = [
	'05:00',
	'06:00',
	'07:00',
	'08:00',
	'09:00',
	'10:00',
	'11:00',
	'12:00',
	'13:00',
	'14:00',
	'15:00',
	'16:00',
	'17:00',
	'18:00',
	'19:00',
	'20:00'
]
