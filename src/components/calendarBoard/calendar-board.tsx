'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { type CalendarEvent, type EventType, eventTypeConfig } from '@/types/calendar-types.ts'
import { type Lead } from '@/types/crm-types'
import { type KanbanCard } from '@/types/kanban-types'
import {
	AlertCircle,
	Bell,
	CalendarDays,
	CheckSquare,
	ChevronLeft,
	ChevronRight,
	Clock,
	Edit2,
	Link2,
	MoreHorizontal,
	Phone,
	Plus,
	Trash2,
	Users
} from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'
import { outerLeads } from '../crmBoard/crm-board.tsx'
import { EventDialog } from './event-dialog.tsx'

const eventTypeIcons: Record<EventType, React.ReactNode> = {
	meeting: <Users className="size-3" />,
	call: <Phone className="size-3" />,
	task: <CheckSquare className="size-3" />,
	reminder: <Bell className="size-3" />,
	deadline: <AlertCircle className="size-3" />
}

interface CalendarBoardProps {
	leads?: Lead[]
	kanbanCards?: KanbanCard[]
}

export const initialEvents: CalendarEvent[] = [
	{
		id: '1',
		title: 'Call with Sarah Chen',
		description: 'Discuss enterprise plan details',
		date: new Date(),
		startTime: '10:00',
		endTime: '11:00',
		type: 'call',
		leadId: '1',
		leadName: 'Sarah Chen',
		leadStatus: 'qualified',
		createdAt: new Date()
	},
	{
		id: '2',
		title: 'Team sync',
		description: 'Weekly team meeting',
		date: new Date(),
		startTime: '14:00',
		endTime: '15:00',
		type: 'meeting',
		createdAt: new Date()
	},
	{
		id: '3',
		title: 'Proposal deadline',
		description: 'Send proposal to GlobalTech',
		date: new Date(new Date().setDate(new Date().getDate() + 2)),
		type: 'deadline',
		leadId: '4',
		leadName: 'David Kim',
		leadStatus: 'negotiation',
		createdAt: new Date()
	},
	{
		id: '4',
		title: 'Follow up - Marcus',
		date: new Date(new Date().setDate(new Date().getDate() + 1)),
		startTime: '09:00',
		type: 'reminder',
		leadId: '2',
		leadName: 'Marcus Johnson',
		leadStatus: 'proposal',
		createdAt: new Date()
	},
	{
		id: '5',
		title: 'Product demo',
		description: 'Demo for potential client',
		date: new Date(),
		startTime: '11:30',
		endTime: '12:30',
		type: 'meeting',
		createdAt: new Date()
	},
	{
		id: '6',
		title: 'Review proposal',
		description: 'Finalize pricing structure',
		date: new Date(),
		startTime: '16:00',
		endTime: '17:00',
		type: 'task',
		kanbanCardId: 'k1',
		kanbanCardTitle: 'Research competitor pricing',
		kanbanCardType: 'task',
		createdAt: new Date()
	}
]

const sampleLeads: Lead[] = [
	{
		id: '1',
		name: 'Sarah Chen',
		email: 'sarah@techcorp.com',
		company: 'TechCorp Inc.',
		status: 'qualified',
		note: '',
		info: '',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: '2',
		name: 'Marcus Johnson',
		email: 'marcus@startupxyz.io',
		company: 'StartupXYZ',
		status: 'proposal',
		note: '',
		info: '',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: '4',
		name: 'David Kim',
		email: 'david@globaltech.com',
		company: 'GlobalTech Solutions',
		status: 'negotiation',
		note: '',
		info: '',
		createdAt: new Date(),
		updatedAt: new Date()
	}
]

const sampleKanbanCards: KanbanCard[] = [
	{
		id: 'k1',
		title: 'Research competitor pricing',
		type: 'task',
		createdAt: new Date()
	},
	{
		id: 'k2',
		title: 'New onboarding flow',
		type: 'idea',
		createdAt: new Date()
	},
	{
		id: 'k3',
		title: 'API performance metrics',
		type: 'data',
		createdAt: new Date()
	}
]

const dayTimeSlots = [
	'06:00',
	'06:30',
	'07:00',
	'07:30',
	'08:00',
	'08:30',
	'09:00',
	'09:30',
	'10:00',
	'10:30',
	'11:00',
	'11:30',
	'12:00',
	'12:30',
	'13:00',
	'13:30',
	'14:00',
	'14:30',
	'15:00',
	'15:30',
	'16:00',
	'16:30',
	'17:00',
	'17:30',
	'18:00',
	'18:30',
	'19:00',
	'19:30',
	'20:00',
	'20:30',
	'21:00',
	'21:30',
	'22:00'
]
const getEventsFromLeads = () => {
	return outerLeads.map((lead) => {
		if (lead !== undefined && lead.action !== undefined) {
			return {
				id: lead.id,
				title: lead.action?.title,
				date: lead.action?.date,
				startTime: lead.action?.startTime,
				endTime: lead.action?.endTime
			}
		}
	})
}

export function CalendarBoard({ leads = sampleLeads, kanbanCards = sampleKanbanCards }: CalendarBoardProps) {
	const [currentDate, setCurrentDate] = useState(new Date())
	const [events, setEvents] = useState<CalendarEvent[]>([...initialEvents])
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
	const [selectedDate, setSelectedDate] = useState<Date | null>(null)
	const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
	const [view, setView] = useState<'month' | 'week' | 'day'>('month')

	const today = new Date()
	const year = currentDate.getFullYear()
	const month = currentDate.getMonth()

	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

	const daysInMonth = new Date(year, month + 1, 0).getDate()
	const firstDayOfMonth = new Date(year, month, 1).getDay()

	const days = useMemo(() => {
		const result: (Date | null)[] = []
		for (let i = 0; i < firstDayOfMonth; i++) {
			result.push(null)
		}
		for (let i = 1; i <= daysInMonth; i++) {
			result.push(new Date(year, month, i))
		}
		return result
	}, [year, month, daysInMonth, firstDayOfMonth])

	const getWeekDays = useMemo(() => {
		const startOfWeek = new Date(currentDate)
		const day = startOfWeek.getDay()
		startOfWeek.setDate(startOfWeek.getDate() - day)

		const weekDays: Date[] = []
		for (let i = 0; i < 7; i++) {
			weekDays.push(new Date(startOfWeek))
			startOfWeek.setDate(startOfWeek.getDate() + 1)
		}
		return weekDays
	}, [currentDate])

	const getEventsForDate = (date: Date) => {
		return events.filter(
			(event) =>
				event.date.getFullYear() === date.getFullYear() &&
				event.date.getMonth() === date.getMonth() &&
				event.date.getDate() === date.getDate()
		)
	}

	const getTodayEvents = useMemo(() => {
		return getEventsForDate(today).sort((a, b) => {
			if (!a.startTime) return 1
			if (!b.startTime) return -1
			return a.startTime.localeCompare(b.startTime)
		})
	}, [events, today])

	const isToday = (date: Date) => {
		return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
	}

	const handlePrev = () => {
		if (view === 'month') {
			setCurrentDate(new Date(year, month - 1, 1))
		} else if (view === 'week') {
			const newDate = new Date(currentDate)
			newDate.setDate(newDate.getDate() - 7)
			setCurrentDate(newDate)
		} else {
			const newDate = new Date(currentDate)
			newDate.setDate(newDate.getDate() - 1)
			setCurrentDate(newDate)
		}
	}

	const handleNext = () => {
		if (view === 'month') {
			setCurrentDate(new Date(year, month + 1, 1))
		} else if (view === 'week') {
			const newDate = new Date(currentDate)
			newDate.setDate(newDate.getDate() + 7)
			setCurrentDate(newDate)
		} else {
			const newDate = new Date(currentDate)
			newDate.setDate(newDate.getDate() + 1)
			setCurrentDate(newDate)
		}
	}

	const handleAddEvent = (date?: Date, time?: string) => {
		setEditingEvent(null)
		setSelectedDate(date || null)
		setSelectedTime(time)
		setDialogOpen(true)
	}

	const handleEditEvent = (event: CalendarEvent) => {
		setEditingEvent(event)
		setSelectedDate(null)
		setSelectedTime(undefined)
		setDialogOpen(true)
	}

	const handleDeleteEvent = (id: string) => {
		setEvents((prev) => prev.filter((e) => e.id !== id))
	}

	const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id' | 'createdAt'> & { id?: string }) => {
		if (eventData.id) {
			setEvents((prev) => prev.map((e) => (e.id === eventData.id ? ({ ...e, ...eventData } as CalendarEvent) : e)))
		} else {
			const newEvent: CalendarEvent = {
				...eventData,
				id: crypto.randomUUID(),
				createdAt: new Date()
			}
			setEvents((prev) => [...prev, newEvent])
		}
		setEditingEvent(null)
		setSelectedDate(null)
		setSelectedTime(undefined)
	}

	const formatDateHeader = () => {
		if (view === 'day') {
			return currentDate.toLocaleDateString('en-US', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
				year: 'numeric'
			})
		}
		return `${monthNames[month]} ${year}`
	}

	const getTimeSlotHeight = (startTime: string, endTime: string) => {
		const start = dayTimeSlots.indexOf(startTime)
		const end = dayTimeSlots.indexOf(endTime)
		if (start === -1 || end === -1) return 1
		return Math.max(1, end - start)
	}

	const EventCard = ({ event, compact = false }: { event: CalendarEvent; compact?: boolean }) => {
		console.log(event)
		return (
			<div
				className={cn(
					'group flex items-start gap-1.5 p-1.5 rounded-md border text-xs cursor-pointer transition-colors',
					event.type ? eventTypeConfig[event.type].color : ''
				)}
			>
				<span className="mt-0.5 shrink-0">{eventTypeIcons[event.type]}</span>
				<div className="flex-1 min-w-0">
					<p className="font-medium truncate">{event.title}</p>
					{!compact && event.startTime && (
						<p className="text-[10px] opacity-70">
							{event.startTime}
							{event.endTime && ` - ${event.endTime}`}
						</p>
					)}
					{!compact && (event.leadName || event.kanbanCardTitle) && (
						<div className="flex items-center gap-1 mt-0.5">
							<Link2 className="size-2.5 opacity-50" />
							<span className="text-[10px] opacity-70 truncate">{event.leadName || event.kanbanCardTitle}</span>
						</div>
					)}
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded transition-opacity">
							<MoreHorizontal className="size-3" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => handleEditEvent(event)}>
							<Edit2 className="size-3 mr-2" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleDeleteEvent(event.id)} className="text-red-400">
							<Trash2 className="size-3 mr-2" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		)
	}

	const DayEventCard = ({ event }: { event: CalendarEvent }) => (
		<div
			className={cn(
				'group flex items-start gap-3 p-3 rounded-lg border text-sm cursor-pointer transition-all hover:scale-[1.01]',
				eventTypeConfig[event.type].color
			)}
		>
			<div className={cn('flex items-center justify-center size-10 rounded-lg shrink-0', 'bg-white/10')}>
				{event.type === 'meeting' && <Users className="size-5" />}
				{event.type === 'call' && <Phone className="size-5" />}
				{event.type === 'task' && <CheckSquare className="size-5" />}
				{event.type === 'reminder' && <Bell className="size-5" />}
				{event.type === 'deadline' && <AlertCircle className="size-5" />}
			</div>
			<div className="flex-1 min-w-0">
				<p className="font-semibold truncate">{event.title}</p>
				{event.startTime && (
					<div className="flex items-center gap-1.5 mt-1 text-xs opacity-80">
						<Clock className="size-3" />
						<span>
							{event.startTime}
							{event.endTime && ` - ${event.endTime}`}
						</span>
					</div>
				)}
				{event.description && <p className="text-xs opacity-70 mt-1 truncate">{event.description}</p>}
				{(event.leadName || event.kanbanCardTitle) && (
					<div className="flex items-center gap-1.5 mt-2">
						<Link2 className="size-3 opacity-50" />
						<span className="text-xs opacity-70 truncate">{event.leadName || event.kanbanCardTitle}</span>
					</div>
				)}
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-opacity">
						<MoreHorizontal className="size-4" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => handleEditEvent(event)}>
						<Edit2 className="size-4 mr-2" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleDeleteEvent(event.id)} className="text-red-400">
						<Trash2 className="size-4 mr-2" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)

	return (
		<div className="flex flex-col h-screen bg-background">
			<header className="flex items-center justify-between px-6 py-4 border-b border-border">
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
						<CalendarDays className="size-5 text-primary" />
					</div>
					<div>
						<h1 className="text-lg font-semibold text-foreground">Calendar</h1>
						<p className="text-xs text-muted-foreground">Schedule meetings and track deadlines</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div className="flex items-center bg-secondary/50 rounded-lg p-1">
						<button
							onClick={() => setView('month')}
							className={cn(
								'px-3 py-1.5 text-sm rounded-md transition-colors',
								view === 'month' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
							)}
						>
							Month
						</button>
						<button
							onClick={() => setView('week')}
							className={cn(
								'px-3 py-1.5 text-sm rounded-md transition-colors',
								view === 'week' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
							)}
						>
							Week
						</button>
						<button
							onClick={() => {
								setView('day')
								setCurrentDate(new Date())
							}}
							className={cn(
								'px-3 py-1.5 text-sm rounded-md transition-colors',
								view === 'day' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
							)}
						>
							Day
						</button>
					</div>
					<Button onClick={() => handleAddEvent()}>
						<Plus className="size-4 mr-1" />
						Add Event
					</Button>
				</div>
			</header>

			<div className="px-6 py-3 border-b border-border">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" onClick={handlePrev}>
							<ChevronLeft className="size-4" />
						</Button>
						<h2 className="text-lg font-semibold min-w-[280px] text-center">{formatDateHeader()}</h2>
						<Button variant="ghost" size="icon" onClick={handleNext}>
							<ChevronRight className="size-4" />
						</Button>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							setCurrentDate(new Date())
							if (view === 'day') setView('day')
						}}
					>
						Today
					</Button>
				</div>
			</div>

			<div className="flex-1 overflow-auto p-6">
				{view === 'month' ? (
					<div className="h-full">
						<div className="grid grid-cols-7 gap-px mb-px">
							{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
								<div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground">
									{day}
								</div>
							))}
						</div>
						<div className="grid grid-cols-7 gap-px bg-border/50 rounded-lg overflow-hidden">
							{days.map((day, idx) => {
								if (!day) {
									return <div key={`empty-${idx}`} className="min-h-[120px] bg-card/50" />
								}
								const dayEvents = getEventsForDate(day)
								const isCurrentDay = isToday(day)
								const allEvents = [
									...dayEvents,
									getEventsFromLeads()
										.filter((item) => item !== undefined)
										.flat()
								]

								return (
									<div
										key={day.toISOString()}
										className={cn(
											'min-h-[120px] bg-card p-2 group/day transition-colors hover:bg-card/80',
											isCurrentDay && 'bg-primary/15'
										)}
									>
										<div className="flex items-center justify-between mb-1">
											<button
												onClick={() => {
													setCurrentDate(day)
													setView('day')
												}}
												className={cn(
													'inline-flex items-center justify-center size-7 text-sm rounded-full transition-colors hover:bg-secondary',
													isCurrentDay ? 'bg-primary text-primary-foreground font-semibold' : 'text-foreground'
												)}
											>
												{day.getDate()}
											</button>
											<button
												onClick={() => handleAddEvent(day)}
												className="opacity-0 group-hover/day:opacity-100 p-1 hover:bg-secondary rounded transition-opacity"
											>
												<Plus className="size-3.5 text-muted-foreground" />
											</button>
										</div>
										<div className="space-y-1">
											{allEvents.flat().map((event) => (
												<EventCard key={event.id} event={event} compact />
											))}
											{/* {dayEvents.length > 3 && (
												<p className="text-xs text-muted-foreground pl-1">+{dayEvents.length - 3} more</p>
											)} */}
										</div>
									</div>
								)
							})}
						</div>
					</div>
				) : view === 'week' ? (
					<div className="h-full">
						<div className="grid grid-cols-8 gap-px mb-px">
							<div className="py-2 text-center text-sm font-medium text-muted-foreground" />
							{getWeekDays.map((day) => (
								<div key={day.toISOString()} className={cn('py-2 text-center', isToday(day) && 'bg-primary/10 rounded-t-lg')}>
									<p className="text-xs text-muted-foreground">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.getDay()]}</p>
									<button
										onClick={() => {
											setCurrentDate(day)
											setView('day')
										}}
										className={cn('text-lg font-semibold hover:underline', isToday(day) ? 'text-primary' : 'text-foreground')}
									>
										{day.getDate()}
									</button>
								</div>
							))}
						</div>
						<div className="grid grid-cols-8 gap-px bg-border/50 rounded-lg overflow-hidden max-h-[calc(100vh-280px)] overflow-y-auto">
							{['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => (
								<Fragment key={`row-${time}`}>
									<div className="py-4 px-2 text-xs text-muted-foreground text-right bg-card">{time}</div>
									{getWeekDays.map((day) => {
										const dayEvents = getEventsForDate(day).filter((e) => e.startTime === time)
										return (
											<div
												key={`${day.toISOString()}-${time}`}
												className={cn(
													'min-h-[60px] bg-card p-1 group/cell border-b border-border/30 cursor-pointer hover:bg-secondary/30',
													isToday(day) && 'bg-primary/5'
												)}
												onClick={() => handleAddEvent(day, time)}
											>
												{dayEvents.map((event) => (
													<EventCard key={event.id} event={event} />
												))}
											</div>
										)
									})}
								</Fragment>
							))}
						</div>
					</div>
				) : (
					<div className="h-full flex gap-6">
						{/* Day View - Timeline */}
						<div className="flex-1 flex flex-col">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-sm font-medium text-muted-foreground">
									{isToday(currentDate) ? "Today's Schedule" : 'Schedule'}
								</h3>
								<Badge variant="outline" className="text-xs">
									{getEventsForDate(currentDate).length} events
								</Badge>
							</div>
							<div className="flex-1 overflow-y-auto pr-2">
								<div className="relative">
									{dayTimeSlots
										.filter((_, i) => i % 2 === 0)
										.map((time) => {
											const slotEvents = getEventsForDate(currentDate).filter(
												(e) => e.startTime === time || e.startTime === dayTimeSlots[dayTimeSlots.indexOf(time) + 1]
											)

											return (
												<div key={time} className="flex gap-4 group/slot">
													<div className="w-16 py-3 text-xs text-muted-foreground text-right shrink-0">{time}</div>
													<div
														className="flex-1 min-h-[60px] border-t border-border/50 py-2 relative cursor-pointer hover:bg-secondary/20 rounded transition-colors"
														onClick={() => handleAddEvent(currentDate, time)}
													>
														<button
															className="absolute right-2 top-2 opacity-0 group-hover/slot:opacity-100 p-1 hover:bg-secondary rounded transition-opacity"
															onClick={(e) => {
																e.stopPropagation()
																handleAddEvent(currentDate, time)
															}}
														>
															<Plus className="size-3.5 text-muted-foreground" />
														</button>
														<div className="space-y-2">
															{slotEvents.map((event) => (
																<DayEventCard key={event.id} event={event} />
															))}
														</div>
													</div>
												</div>
											)
										})}
								</div>
							</div>
						</div>

						{/* Day View - Sidebar with all events */}
						<div className="w-80 border-l border-border pl-6">
							<div className="sticky top-0">
								<h3 className="text-sm font-medium text-muted-foreground mb-4">All Events</h3>
								{getEventsForDate(currentDate).length === 0 ? (
									<div className="text-center py-8">
										<div className="flex items-center justify-center size-12 rounded-full bg-secondary/50 mx-auto mb-3">
											<CalendarDays className="size-6 text-muted-foreground" />
										</div>
										<p className="text-sm text-muted-foreground">No events scheduled</p>
										<Button variant="outline" size="sm" className="mt-3" onClick={() => handleAddEvent(currentDate)}>
											<Plus className="size-3.5 mr-1" />
											Add Event
										</Button>
									</div>
								) : (
									<div className="space-y-3">
										{getEventsForDate(currentDate)
											.sort((a, b) => {
												if (!a.startTime) return 1
												if (!b.startTime) return -1
												return a.startTime.localeCompare(b.startTime)
											})
											.map((event) => (
												<div
													key={event.id}
													className={cn(
														'p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02]',
														eventTypeConfig[event.type].color
													)}
													onClick={() => handleEditEvent(event)}
												>
													<div className="flex items-start gap-2">
														<span className="mt-0.5">{eventTypeIcons[event.type]}</span>
														<div className="flex-1 min-w-0">
															<p className="font-medium text-sm truncate">{event.title}</p>
															{event.startTime && (
																<p className="text-xs opacity-70 mt-0.5">
																	{event.startTime}
																	{event.endTime && ` - ${event.endTime}`}
																</p>
															)}
															{event.description && (
																<p className="text-xs opacity-60 mt-1 line-clamp-2">{event.description}</p>
															)}
															{(event.leadName || event.kanbanCardTitle) && (
																<div className="flex items-center gap-1 mt-1.5">
																	<Link2 className="size-2.5 opacity-50" />
																	<span className="text-[10px] opacity-70">
																		{event.leadName || event.kanbanCardTitle}
																	</span>
																</div>
															)}
														</div>
													</div>
												</div>
											))}
									</div>
								)}

								{/* Quick stats */}
								{getEventsForDate(currentDate).length > 0 && (
									<div className="mt-6 pt-4 border-t border-border">
										<h4 className="text-xs font-medium text-muted-foreground mb-3">By Type</h4>
										<div className="grid grid-cols-2 gap-2">
											{(Object.keys(eventTypeConfig) as EventType[])
												.filter((type) => {
													const count = getEventsForDate(currentDate).filter((e) => e.type === type).length
													return count > 0
												})
												.map((type) => {
													const count = getEventsForDate(currentDate).filter((e) => e.type === type).length
													return (
														<div
															key={type}
															className={cn(
																'flex items-center gap-2 p-2 rounded-md text-xs',
																eventTypeConfig[type].color
															)}
														>
															{eventTypeIcons[type]}
															<span className="capitalize">{type}</span>
															<span className="ml-auto font-medium">{count}</span>
														</div>
													)
												})}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>

			<EventDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onSave={handleSaveEvent}
				editEvent={editingEvent}
				initialDate={selectedDate || undefined}
				initialTime={selectedTime}
				leads={leads}
				kanbanCards={kanbanCards}
			/>
		</div>
	)
}
