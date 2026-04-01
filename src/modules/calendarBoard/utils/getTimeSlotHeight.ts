import { dayTimeSlots } from '@/data/dayTimeSlots'

export const getTimeSlotHeight = (startTime: string, endTime: string) => {
	const start = dayTimeSlots.indexOf(startTime)
	const end = dayTimeSlots.indexOf(endTime)
	if (start === -1 || end === -1) return 1
	return Math.max(1, end - start)
}
