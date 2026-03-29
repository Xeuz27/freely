import { cn } from '@/lib/utils'
import type { CalendarEvent } from '@/types/calendar-types.ts'
import { Plus } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { getEventsFromLeads } from '../utils/getEventsFromLeads'
import { handleAddEvent } from '../utils/handlers.ts'
import { isToday } from '../utils/isToday.ts'
import EventCard from './event-card.tsx'

const monthGrid = ({
	days,
	getEventsForDate,
	setCurrentDate,
	setView
}: {
	days: (Date | null)[]
	getEventsForDate: (date: Date) => CalendarEvent[]
	setCurrentDate: Dispatch<SetStateAction<Date>>
	setView: Dispatch<SetStateAction<'month' | 'week' | 'day'>>
}) => {
	return (
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
					const allEvents = [...dayEvents, getEventsFromLeads().flat()]

					return (
						<div
							key={day.toISOString()}
							className={cn('min-h-[120px] bg-card p-2 group/day transition-colors hover:bg-card/80', isCurrentDay && 'bg-primary/15')}
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
								{dayEvents.flat().map((event) => (
									<EventCard key={event.id} event={event} compact />
								))}
								{dayEvents.length > 3 && <p className="text-xs text-muted-foreground pl-1">+{dayEvents.length - 3} more</p>}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default monthGrid
