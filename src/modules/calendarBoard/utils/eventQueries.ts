import { dayTimeSlots } from '@/data/dayTimeSlots'
import type { CalendarEvent } from '@/types/calendar-types'
import { format } from '@formkit/tempo'

type TimeSlot = (typeof dayTimeSlots)[number]

export type DayEvent = { day: string; event: CalendarEvent | null }

export type WeekEventsByHour = {
	[key in TimeSlot]: DayEvent[]
}

export type EventsByDayAndHour = {
	[k: string]: Record<TimeSlot, CalendarEvent | null>
}

export const isSameDay = (a: Date, b: Date) =>
	//prettier-ignore
	a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate()

export const getEventsForDate = (events: CalendarEvent[], date: Date) => {
	return events.filter((event) => isSameDay(event.date, date))
}

export const sortEventsByStartTime = (events: CalendarEvent[]) =>
	[...events].sort((a, b) => {
		if (!a.startTime) return 1
		if (!b.startTime) return -1
		return a.startTime.localeCompare(b.startTime)
	})

export const mapDayEventsToTimeSlots = (events: CalendarEvent[]): Record<TimeSlot, CalendarEvent | null> =>
	Object.fromEntries(dayTimeSlots.map((ts) => [ts, events.find((e) => e.startTime === ts) ?? null])) as Record<TimeSlot, CalendarEvent | null>

export const buildEventsDayHour = (weekDays: Date[], getEventsForDay: (day: Date) => CalendarEvent[]): EventsByDayAndHour =>
	Object.fromEntries(weekDays.map((day) => [format(day, 'YYYY-MM-DD'), mapDayEventsToTimeSlots(getEventsForDay(day))]))

export const buildEventsHourDay = (weekDays: Date[], eventsDayHour: EventsByDayAndHour): WeekEventsByHour => {
	const result = {} as WeekEventsByHour

	for (const time of dayTimeSlots) {
		result[time] = weekDays.map((day) => {
			const dayKey = format(day, 'YYYY-MM-DD')
			return {
				day: dayKey,
				event: eventsDayHour[dayKey][time]
			}
		})
	}

	return result
}
