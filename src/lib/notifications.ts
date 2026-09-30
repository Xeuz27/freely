import { wToast } from '@yidev/wtoast'
import '@yidev/wtoast/index.css'

const { show } = wToast()

export type NotificationMode = 'browser' | 'toast'

export type NotificationPayload = {
	title: string
	body: string
	type?: 'default' | 'success' | 'error'
	duration?: number
	className?: string
}

export const canUseBrowserNotifications = (): boolean => typeof window !== 'undefined' && 'Notification' in window

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
	if (!canUseBrowserNotifications()) {
        console.warn('This browser does not support desktop notification')
        return 'denied'
    } 

	if (Notification.permission === 'granted') return 'granted'
	if (Notification.permission === 'denied') return 'denied'

	return await Notification.requestPermission()
}

export const sendNotification = async (payload: NotificationPayload): Promise<{ mode: NotificationMode; permission: NotificationPermission }> => {
	const permission = await requestNotificationPermission()

	if (permission === 'granted' && canUseBrowserNotifications()) {
		new Notification(payload.title, {
			body: payload.body
		})
		return { mode: 'browser', permission }
	}

	show(payload.body, {
        title: payload.title,
        close: 'both',
        icon: ' ',
		type: payload.type ?? 'default',
		duration: payload.duration ?? 6000,
		className: payload.className ?? 'bg-card! [&_.timeLeft]:bg-white/40! [&_.timeLeft]:h-[1px]! text-accent-foreground/80! outline-1! rounded-xs! font-light! outline-accent-foreground/20!'
	})

	return { mode: 'toast', permission }
}
