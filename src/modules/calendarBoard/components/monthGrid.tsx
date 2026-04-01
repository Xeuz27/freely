import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import useCalendarContext from '../hooks/useCalendarContext.ts'
import { getEventsFromLeads } from '../utils/getEventsFromLeads'
import { handleAddEvent } from '../utils/handlers.ts'
import { isToday } from '../utils/isToday.ts'
import EventCard from './event-card.tsx'

const MonthGrid = ({ days }: { days: (Date | null)[] }) => {
	const { getEventsForDate, setCurrentDate, setView, setEditingEvent, setDialogOpen, selectedTime, setSelectedDate, setSelectedTime } =
		useCalendarContext()
	return (
		<div className="">
			<div className="grid grid-cols-7 sticky top-0 bg-background gap-px mb-px">
				{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
					<div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground">
						{day}
					</div>
				))}
			</div>
			<div className="grid grid-cols-7 gap-0.5 bg-sidebar/20">
				{days.map((day, idx) => {
					if (!day) {
						return <div key={`empty-${idx}`} className="min-h-[120px] bg-card/5" />
					}
					const dayEvents = getEventsForDate(day)
					const isCurrentDay = isToday(day)
					const allEvents = [...dayEvents, getEventsFromLeads().flat()]
					// fechear bien los eventos
					return (
						<div
							key={day.toISOString()}
							className={cn(
								'min-h-[120px] bg-card/40 p-2 group/day transition-colors border border-transparent hover:border-accent/30 hover:bg-background/10',
								isCurrentDay && 'bg-primary/20'
							)}
						>
							<div className="flex items-center justify-between mb-1">
								<button
									onClick={() => {
										setCurrentDate(day)
										setView('day')
									}}
									className={cn(
										'inline-flex items-center  justify-center size-6 text-sm rounded-full transition-colors hover:bg-primary/60',
										isCurrentDay ? 'bg-primary text-primary-foreground font-semibold' : ' text-foreground'
									)}
								>
									{day.getDate()}
								</button>
								<button
									onClick={() => {
										handleAddEvent(day, selectedTime, setEditingEvent, setSelectedDate, setSelectedTime, setDialogOpen)
									}}
									className="opacity-0 group-hover/day:opacity-100 p-1 hover:bg-secondary rounded-full transition-opacity"
								>
									<Plus className="size-5 pl-px text-muted-foreground" />
								</button>
							</div>
							<div className="space-y-1">
								{dayEvents
									.flat()
									.map((event) => <EventCard event={event} compact />)
									.slice(0, 3)}
								{dayEvents.length > 3 && <p className="text-xs text-muted-foreground pt-1">+{dayEvents.length - 3} more</p>}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export { MonthGrid }
