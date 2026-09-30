import { sendNotification } from '@/lib/notifications'
import type { CalendarEvent } from '@/types/calendar-types'
import { format } from '@formkit/tempo'
import { useEffect, useMemo, useRef } from 'react'
import { useWeekEvents } from './useWeekEvents'

const REMINDER_WINDOW_MS = 30 * 60 * 1000
const CHECK_INTERVAL_MS = 15 * 1000
const STORAGE_KEY = 'freely-notified-events'

const getEventDateTime = (event: { date: Date; startTime?: string }) => {
	if (!event.startTime) return null

	const eventDate = new Date(event.date)
	const [hours, minutes] = event.startTime.split(':').map(Number)

	if (Number.isNaN(hours) || Number.isNaN(minutes)) return null

	eventDate.setHours(hours, minutes, 0, 0)
	return eventDate
}

const persistNotifiedIds = (ids: Set<string>) => {
	if (typeof window === 'undefined') return
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

export const useEventReminders = () => {
	const { eventsDayHour } = useWeekEvents(new Date())
	const notifiedIdsRef = useRef<Set<string>>(new Set())

	const todayKey = format(new Date(), 'YYYY-MM-DD')
	const todayEvents = useMemo<CalendarEvent[]>(() => {
		const slots = eventsDayHour[todayKey]
		if (!slots) return []

		return Object.values(slots).filter(Boolean) as CalendarEvent[]
	}, [eventsDayHour, todayKey])

	const checkReminders = () => {
		const now = Date.now()

		for (const event of todayEvents) {
			if (!event.startTime) continue
			if (notifiedIdsRef.current.has(event.id)) continue

			const eventDateTime = getEventDateTime(event)
			if (!eventDateTime) continue

			const diffMs = eventDateTime.getTime() - now
			const diffMinutes = Math.floor(diffMs / 60000)
			const isSoonEnough = diffMs >= 0 && diffMs <= REMINDER_WINDOW_MS
			const isPastDue = diffMs < 0

			if (isPastDue && diffMinutes > -60) {
				sendNotification({
					title: `Event "${event.title}" is past due!`,
					body: `The event scheduled for ${event.startTime} has already started or passed.`,
					type: 'error',
					duration: 10000,
					className: 'bg-background! [&_.timeLeft]:bg-white/40! [&_.timeLeft]:h-[1px]! text-accent-foreground/80! outline-1! rounded-xs! font-light! outline-foreground/20!'
				})
			}
			if (!isSoonEnough || isPastDue) continue

			sendNotification({
				title: `Upcoming Event: "${event.title}"`,
				body: `Your event is scheduled to start at ${event.startTime}.`,
				type: 'default',
				duration: 10000,
				className: 'bg-card! [&_.timeLeft]:bg-white/40! [&_.timeLeft]:h-[1px]! text-accent-foreground/80! outline-1! rounded-xs! font-light! outline-accent-foreground/20!'
			})

			notifiedIdsRef.current.add(event.id)
			persistNotifiedIds(notifiedIdsRef.current)
		}
	}

	useEffect(() => {
		if (typeof window === 'undefined') return

		try {
			const storedIds = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]') as string[]
			notifiedIdsRef.current = new Set(storedIds)
		} catch {
			notifiedIdsRef.current = new Set()
		}
	}, [])

	useEffect(() => {
		if (typeof window === 'undefined') return

		checkReminders()
		const timer = window.setInterval(checkReminders, CHECK_INTERVAL_MS)

		return () => window.clearInterval(timer)
	}, [todayEvents])
}
