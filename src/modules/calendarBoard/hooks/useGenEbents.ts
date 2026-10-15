import { timeSlots, type EventType } from '@/types/calendar-types'
import { addHour, format } from '@formkit/tempo'
import { handleSaveEvent } from '../utils/handlers'

const eventOptions: Record<EventType, string[]> = {
	meeting: ['Project sync', 'Design review', 'Team check-in', 'Planning session'],
	call: ['Client call', 'Quick catch-up', 'Follow-up call', 'Intro call'],
	task: ['Review proposal', 'Update roadmap', 'Prepare presentation', 'Send project update'],
	reminder: ['Submit timesheet', 'Renew subscription', 'Check in with Alex', 'Review notes'],
	deadline: ['Proposal due', 'Submit final report', 'Launch milestone', 'Invoice due']
}

const eventTypes: EventType[] = [
	'meeting',
	'meeting',
	'meeting',
	'call',
	'call',
	'task',
	'task',
	'reminder',
	'reminder',
	'deadline'
]

const workTimeSlots = timeSlots.filter((time) => time >= '09:00' && time <= '16:30')
const startTimeSlots = workTimeSlots.slice(0, -2)

const randomItem = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)]

const getRandomDate = (start: Date) => {
	const date = new Date(start)
	date.setDate(date.getDate() + Math.floor(Math.random() * 90) + 1)

	if (date.getDay() === 0) date.setDate(date.getDate() + 1)
	if (date.getDay() === 6) date.setDate(date.getDate() + 2)

	return new Date(addHour(format(date, 'YYYY-MM-DD'), 4))
}

const GenEvents = () => {
	const today = new Date()

	for (let index = 0; index < 120; index++) {
		const type = randomItem(eventTypes)
		const startIndex = Math.floor(Math.random() * startTimeSlots.length)
		const startTime = startTimeSlots[startIndex]
		const endTime = workTimeSlots[startIndex + (Math.random() < 0.5 ? 1 : 2)]

		handleSaveEvent({
			title: randomItem(eventOptions[type]),
			type,
			date: getRandomDate(today),
			startTime,
			endTime
		})
	}
}

export default GenEvents
