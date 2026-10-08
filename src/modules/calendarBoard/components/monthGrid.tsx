import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import useCalendarContext from '../hooks/useCalendarContext.ts'
import useMonthEvents from '../hooks/useMonthEvents.ts'
import GenEvents from '../hooks/useGenEbents.ts'
import { handleAddEvent } from '../utils/handlers.ts'
import { isToday } from '../utils/isToday.ts'
import EventCard from './event-card.tsx'

const MonthGrid = () => {
	const monthDays = useMonthEvents()
	const { setCurrentDate, setView, setEditingEvent, setDialogOpen, selectedTime, setSelectedDate, setSelectedTime } =
		useCalendarContext()
	return (
		<div className="h-full overflow-y-hidden pb-2">
			
			{/* <div className="w-full hidden">
				<button onClick={() => GenEvents()} className="p-4 border-2 border-red-400 px-8 text-white font-bold text-lg">
					click here!
				</button>
			</div> */}
			<div className="grid grid-cols-7 gap-px mb-px">
				{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
					<div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground">
						{day}
					</div>
				))}
			</div>
	
			<div className="grid grid-cols-7 h-full pb-8 overflow-y-auto gap-0.5 bg-sidebar/20">
				{monthDays.map(({ day, events: dayEvents }, idx) => {
					if (!day) {
						return <div key={`empty-${idx}`} className="md:min-h-30 bg-card/5" />
					}
					const isCurrentDay = isToday(day)

					return (
						<div
							key={day.toISOString()}
							className={cn(
								'md:min-h-30 bg-card/40 p-2 group/day transition-colors border border-transparent hover:border-accent/30 hover:bg-background/10',
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
										'inline-flex items-center max-md:p-2 max-md:size-4 justify-center size-6 text-sm rounded-full transition-colors hover:bg-primary/60',
										isCurrentDay ? 'bg-primary text-primary-foreground font-semibold' : ' text-foreground'
									)}
								>
									{day.getDate()}
								</button>
								<button
									onClick={() => {
										handleAddEvent(day, selectedTime, setEditingEvent, setSelectedDate, setSelectedTime, setDialogOpen)
									}}
									className="opacity-0 max-md:hidden group-hover/day:opacity-100 p-1 hover:bg-secondary rounded-full transition-opacity"
								>
									<Plus className="size-5 pl-px text-muted-foreground" />
								</button>
							</div>
							<div className="space-y-1 max-md:hidden">
								{dayEvents
									.map((event) => (
										<div key={event.id}>
											<EventCard event={event} compact />
										</div>
									))
									.slice(0, 3)}
								{dayEvents.length > 3 && <p className="text-xs text-muted-foreground pt-1">+{dayEvents.length - 3} more</p>}
							</div>
							<div className="md:hidden">{dayEvents.length >= 1 && <div className="bg-primary size-2 rounded-full"></div>}</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export { MonthGrid }
