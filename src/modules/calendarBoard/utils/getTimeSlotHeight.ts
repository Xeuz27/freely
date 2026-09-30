import { dayTimeSlots } from '@/data/dayTimeSlots'

type TimeSlotHeight = typeof dayTimeSlots[number]

export const getTimeSlotHeight = (startTime: TimeSlotHeight, endTime: TimeSlotHeight) => {
	const start = dayTimeSlots.indexOf(startTime)
	const end = dayTimeSlots.indexOf(endTime)
	if (start === -1 || end === -1) return 1
	return Math.max(1, end - start)
}
