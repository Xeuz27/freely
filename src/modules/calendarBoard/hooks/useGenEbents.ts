import { timeSlots, type EventType } from '@/types/calendar-types'
import { addHour, format } from '@formkit/tempo'
import { handleSaveEvent } from '../utils/handlers'

const fizzbuzzName = (index: number) => {
	if (index % 3 === 0 && index % 5 === 0) {
		return 'sara johnson'
	} else if (index % 3 === 0) {
		return 'pepe perez'
	} else if (index % 5 === 0) {
		return 'jose jose'
	} else {
		return 'mad max'
	}
}
const fizzbuzzTitle = (index: number) => {
	if (index % 3 === 0 && index % 5 === 0) {
		return 'deadline'
	} else if (index % 3 === 0) {
		return 'Call'
	} else if (index % 5 === 0) {
		return 'meet'
	} else {
		return 'reminder'
	}
}
const fizzbuzzEType = (index: number) => {
	if (index % 3 === 0 && index % 5 === 0) {
		return 'deadline'
	} else if (index % 3 === 0) {
		return 'call'
	} else if (index % 5 === 0) {
		return 'meeting'
	} else {
		return 'reminder'
	}
}

const getIncrement = (index: number) => {
	if (index % 3 === 0 && index % 5 === 0) return index
	if (index % 3 === 0) return index - 1
	if (index % 5 === 0) return index + 2
	return index + 1
}
const getTime = (index: number) => {
	if (index % 3 === 0 && index % 5 === 0) return 8
	if (index % 3 === 0) return 16
	if (index % 5 === 0) return 10
	return 12
}

// date: new Date(addHour(format(formState.date!, 'YYYY-MM-DD', 'en'), 4)),
// 				startTime: formState.startTime || undefined,
// 				endTime: formState.endTime || undefined,

const GenEvents = () => {
    console.log("run")
	let start = new Date('2026-06-05')

	const dates = Array.from({ length: 120 }, (_, i) => {
		const date = new Date(start)
		date.setDate(start.getDate() + getIncrement(i))

		return date
	})

	let Arr = Array.from({ length: 120 }, (_, index) => ({
		title: fizzbuzzTitle(index),
		type: fizzbuzzEType(index),
		name: fizzbuzzName(index),
		date: new Date(addHour(format(dates[index], 'YYYY-MM-DD'), 4)),
		startTime: timeSlots[getTime(index)]
	}))

	Arr.map((event) => {
		handleSaveEvent({
			id: window.crypto.randomUUID(),
			title: event.title,
			date: event.date,
			startTime: event.startTime,
			type: event.type as EventType
		})
	})
}
export default GenEvents
