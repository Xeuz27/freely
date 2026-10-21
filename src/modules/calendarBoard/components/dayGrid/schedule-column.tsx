import { Badge } from '@/components/ui/badge'
import { dayTimeSlots } from '@/data/dayTimeSlots'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import useCalendarContext from '../../hooks/useCalendarContext'
import { handleAddEvent } from '../../utils/handlers'
import { isToday } from '../../utils/isToday'
import { DayEventCard } from './day-event-card'
import { useSidebar } from '@/components/ui/sidebar'

const ScheduleColumn = () => {
	const {
		getEventsForDate,
		currentDate,
		selectedTime,
		setEditingEvent,
		setSelectedDate,
		setSelectedTime,
		setDialogOpen
	} = useCalendarContext()
	const dayEvents = getEventsForDate(currentDate)
	const { open } = useSidebar()

	return (
		<div className="flex min-w-0 flex-1 flex-col sm:max-lg:max-w-2/4">
			<div className="flex items-center justify-between py-4 max-md:flex-col">
				<h3 className="text-muted-foreground text-sm font-medium">
					{isToday(currentDate) ? "Today's Schedule" : 'Schedule'}
				</h3>
				<Badge variant="outline" className="border-0 text-xs">
					{dayEvents.length} events
				</Badge>
			</div>
			<div
				className={` ${open ? '' : ''} relative flex min-w-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto pr-2 pb-8 transition-[width] duration-200 ease-linear`}
			>
				{dayTimeSlots
					.filter((_, index) => index % 2 === 0)
					.map((time) => {
						const slotEvents = dayEvents.filter(
							(event) =>
								event.startTime === time ||
								event.startTime === dayTimeSlots[dayTimeSlots.indexOf(time) + 1]
						)

						return (
							<div key={time} className="group/slot flex gap-2">
								<div className="text-muted-foreground w-16 shrink-0 py-3 text-left text-xs max-[769px]:w-8">
									{time}
								</div>
								<div
									className={cn(
										'border-border/50 relative min-h-15 flex-1 cursor-pointer rounded border-t transition-colors sm:max-[769px]:max-w-60',
										slotEvents.length > 0 ? '' : 'hover:bg-secondary/20'
									)}
									onClick={() => {
										handleAddEvent(
											currentDate,
											selectedTime,
											setEditingEvent,
											setSelectedDate,
											setSelectedTime,
											setDialogOpen
										)
										setSelectedTime(time)
									}}
								>
									{slotEvents.length === 0 && (
										<button
											className="hover:bg-secondary absolute top-2 right-2 rounded p-1 opacity-0 transition-opacity group-hover/slot:opacity-100"
											onClick={(event) => {
												event.stopPropagation()
												handleAddEvent(
													currentDate,
													selectedTime,
													setEditingEvent,
													setSelectedDate,
													setSelectedTime,
													setDialogOpen
												)
												setSelectedTime(time)
											}}
										>
											<Plus className="text-muted-foreground size-3.5" />
										</button>
									)}
									<div className="flex flex-col gap-6 px-2">
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
	)
}

export { ScheduleColumn }
