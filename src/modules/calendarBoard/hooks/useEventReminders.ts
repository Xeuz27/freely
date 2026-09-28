import { state } from '@/store/store'
import { useStore } from '@nanostores/react'
import { useEffect, useRef } from 'react'
import { wToast } from '@yidev/wtoast'
import '@yidev/wtoast/index.css'

const REMINDER_WINDOW_MS = 30 * 60 * 1000
const CHECK_INTERVAL_MS = 15 * 1000
const STORAGE_KEY = 'freely-notified-events'

const {show} = wToast()

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
	const $Store = useStore(state)
	const { events } = $Store
	const notifiedIdsRef = useRef<Set<string>>(new Set())

	console.log('useEventReminders rendered')
	if (!window.Notification) {
			console.warn('This browser does not support desktop notification')
			return
		}
		console.log('Notification permission status:', Notification.permission)
		if (Notification.permission !== 'granted') {
			console.log('Requesting notification permission...')	
			
			Notification.requestPermission().then((permission) => {
				console.log(permission, "Notification permission status")	
				if (permission !== 'granted') {
					console.warn('Notification permission denied')
				}
			})
		}
		

    const checkReminders = () => {
            const now = Date.now()
            
			for (const event of events) {
                if (!event.startTime) continue
				if (notifiedIdsRef.current.has(event.id)) continue
                
				const eventDateTime = getEventDateTime(event)
				if (!eventDateTime) continue
                
				const diffMs = eventDateTime.getTime() - now
				const diffMinutes = Math.floor(diffMs / 60000)
                const isSoonEnough = diffMs >= 0 && diffMs <= REMINDER_WINDOW_MS
				const isPastDue = diffMs < 0
                
                // console.log(`Event "${event.title}"

                //     is ${diffMinutes} minutes away.
                //     Soon enough: ${isSoonEnough}, Past due: ${isPastDue}, diffms: ${diffMs}`
                //     )
                    if (isPastDue && (diffMinutes > -60)) {
						setTimeout(() => {
							console.log(`Event "${event.title}" is past due!, in settimeout notification`)
							const notification = new Notification("Hello!", {
								body: `Event "${event.title}" is past due!`,
								// icon: "/path/to/icon.png"
								});
								// notification.onshow = () => {
								// 	setTimeout(() => {
								// 		notification.close();
								// 	}, 5000);
								// };
								// console.log(notification, "Notification object")
						},5000)
                        show(`${event.title} is past due!`, {
                            icon: ' ',
                            close: 'both',
                            title: 'Event reminder (Overdue)',
                            type: 'error',
                            duration: 15000,
                            className: 'bg-card! [&_.timeLeft]:bg-white/40! [&_.timeLeft]:h-[1px]! text-accent-foreground/80! outline-1! rounded-xs! font-light! outline-accent-foreground/20!',
                        }
                    )
                    }
				if (!isSoonEnough || isPastDue) continue
				show(`${event.title} starts at ${event.startTime}`, {
					title: 'Event reminder',
					type: 'default',
					duration: 15000,
                    className: 'bg-card! [&_.timeLeft]:bg-white/40! [&_.timeLeft]:h-[1px]! text-accent-foreground/80! outline-1! rounded-xs! font-light! outline-accent-foreground/20!',
                })

				notifiedIdsRef.current.add(event.id)
				// persistNotifiedIds(notifiedIdsRef.current)
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
	}, [events])
}
