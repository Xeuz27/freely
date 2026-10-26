import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { eventTypeConfig, type EventType } from '@/types/calendar-types'
import { CalendarDays, Plus } from 'lucide-react'
import useCalendarContext from '../../hooks/useCalendarContext'
import useCalendarHandlers from '../../hooks/useCalendarHandlers'
import { sortEventsByStartTime } from '../../utils/eventQueries'
import { eventTypeIcons } from '../calendar-board'
import { DayEventCard } from './day-event-card'

const AllEventsColumn = () => {
	const { getEventsForDate, currentDate, selectedTime } = useCalendarContext()
	const { handleAddEvent } = useCalendarHandlers()
	const dayEvents = sortEventsByStartTime(getEventsForDate(currentDate))
	const eventsByType = (Object.keys(eventTypeConfig) as EventType[])
		.map((type) => ({
			type,
			count: dayEvents.filter((event) => event.type === type).length
		}))
		.filter(({ count }) => count > 0)
	return (
		<div className="border-border relative flex flex-1 flex-col border-l pr-0 pl-4 max-sm:hidden">
			<div className="py-4">
				<h3 className="text-muted-foreground text-sm font-medium">All Events</h3>
			</div>
			<div className="flex-1 overflow-y-auto pr-2 pb-8">
				{dayEvents.length === 0 ? (
					<div className="py-8 text-center">
						<div className="bg-secondary/50 mx-auto mb-3 flex size-12 items-center justify-center rounded-full">
							<CalendarDays className="text-muted-foreground size-6" />
						</div>
						<p className="text-muted-foreground text-sm">No events scheduled</p>
						<Button
							variant="outline"
							size="sm"
							className="mt-3"
							onClick={() => handleAddEvent(currentDate, selectedTime)}
						>
							<Plus className="mr-1 size-3.5" />
							Add Event
						</Button>
					</div>
				) : (
					dayEvents.map((event) => <DayEventCard key={event.id} event={event} className="mb-2" />)
				)}

				{dayEvents.length > 0 && (
					<div className="border-border mt-8 border-t">
						<h4 className="text-muted-foreground py-4 text-xs font-medium">By Type</h4>
						<div className="flex flex-col flex-wrap gap-2">
							{eventsByType.map(({ type, count }) => {
								const Icon = eventTypeIcons[type]
								return (
									<div
										key={type}
										className={cn(
											'flex items-center gap-2 rounded-md p-2 text-xs',
											eventTypeConfig[type].color
										)}
									>
										{Icon && <Icon className="size-4 lg:size-5" />}
										<span className="w-fit capitalize">{type}</span>
										<span className="ml-auto font-medium">{count}</span>
									</div>
								)
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export { AllEventsColumn }
