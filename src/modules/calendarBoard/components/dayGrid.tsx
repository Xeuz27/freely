import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { dayTimeSlots } from '@/data/dayTimeSlots'
import { cn } from '@/lib/utils'
import { eventTypeConfig, type EventType } from '@/types/calendar-types'
import { CalendarDays, Link2, Plus } from 'lucide-react'
import useCalendarContext from '../hooks/useCalendarContext'
import { handleAddEvent, handleEditEvent } from '../utils/handlers'
import { isToday } from '../utils/isToday'
import { eventTypeIcons } from './calendar-board'
import { DayEventCard } from './day-event-card'

const DayGrid = () => {
	const { getEventsForDate, currentDate, selectedTime, setEditingEvent, setSelectedDate, setSelectedTime, setDialogOpen } = useCalendarContext()
	return (
		<div className="h-full flex gap-6">
			{/* Day View - Timeline */}
			<div className="flex-1 flex flex-col">
				<div className="flex items-center justify-between py-4">
					<h3 className="text-sm font-medium text-muted-foreground">{isToday(currentDate) ? "Today's Schedule" : 'Schedule'}</h3>
					<Badge variant="outline" className="text-xs border-0">
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
								console.log(slotEvents)

								return (
									<div key={time} className="flex gap-4 group/slot">
										<div className="w-16 py-3 text-xs text-muted-foreground text-right shrink-0">{time}</div>
										<div
											className={cn(
												'flex-1 min-h-[60px] border-t border-border/50 py-2 relative cursor-pointer  rounded transition-colors',
												slotEvents.length > 0 ? '' : 'hover:bg-secondary/20'
											)}
											onClick={() =>
												handleAddEvent(
													currentDate,
													selectedTime,
													setEditingEvent,
													setSelectedDate,
													setSelectedTime,
													setDialogOpen
												)
											}
										>
											{slotEvents.length === 0 && (
												<button
													className="absolute right-2 top-2 opacity-0 group-hover/slot:opacity-100 p-1 hover:bg-secondary rounded transition-opacity"
													onClick={(e) => {
														e.stopPropagation()
														handleAddEvent(
															currentDate,
															selectedTime,
															setEditingEvent,
															setSelectedDate,
															setSelectedTime,
															setDialogOpen
														)
													}}
												>
													<Plus className="size-3.5 text-muted-foreground" />
												</button>
											)}

											<div className="space-y-2">
												{slotEvents.map((event) => (
													<DayEventCard event={event} />
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
			<div className="w-80 border-l border-border p-6">
				<div className="sticky top-0">
					<h3 className="text-sm font-medium text-muted-foreground mb-4">All Events</h3>
					{getEventsForDate(currentDate).length === 0 ? (
						<div className="text-center py-8">
							<div className="flex items-center justify-center size-12 rounded-full bg-secondary/50 mx-auto mb-3">
								<CalendarDays className="size-6 text-muted-foreground" />
							</div>
							<p className="text-sm text-muted-foreground">No events scheduled</p>
							<Button
								variant="outline"
								size="sm"
								className="mt-3"
								onClick={() =>
									handleAddEvent(currentDate, selectedTime, setEditingEvent, setSelectedDate, setSelectedTime, setDialogOpen)
								}
							>
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
												{event.description && <p className="text-xs opacity-60 mt-1 line-clamp-2">{event.description}</p>}
												{(event.leadName || event.kanbanCardTitle) && (
													<div className="flex items-center gap-1 mt-1.5">
														<Link2 className="size-2.5 opacity-50" />
														<span className="text-[10px] opacity-70">{event.leadName || event.kanbanCardTitle}</span>
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
												className={cn('flex items-center gap-2 p-2 rounded-md text-xs', eventTypeConfig[type].color)}
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
	)
}

export { DayGrid }
