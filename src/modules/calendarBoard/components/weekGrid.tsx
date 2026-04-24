import { dayTimeSlots } from '@/data/dayTimeSlots'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { Fragment } from 'react'
import useCalendarContext from '../hooks/useCalendarContext'
import { handleAddEvent } from '../utils/handlers'
import { isToday } from '../utils/isToday'
import EventCard from './event-card'

const WeekGrid = () => {
	const { getWeekDays, setCurrentDate, setView, getEventsForDate, setEditingEvent, setSelectedDate, setSelectedTime, setDialogOpen } = 
		useCalendarContext()

	return (
		<div className="h-full ">
			<div className="grid grid-cols-8 gap-0.5 mb-px">
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
			<div className="grid grid-cols-8 gap-0.5 bg-background/10 rounded-lg overflow-hidden max-h-[calc(100vh-220px)] overflow-y-auto">
				{dayTimeSlots.map((time) => (
					<Fragment key={`row-${time}`}>
						<div className="py-4 px-2 text-xs text-muted-foreground text-right bg-card/60">{time}</div>
						{getWeekDays.map((day) => {
							const dayEvents = getEventsForDate(day).filter((e) => e.startTime === time)

							return (
								<div
									key={`${day.toISOString()}-${time}`}
									className={cn(
										'min-h-[60px] bg-card/40 p-1 gap-2 flex flex-col group/time cursor-pointer  border border-transparent',
										dayEvents.length === 1 ? '' : 'hover:bg-background/40 hover:border-accent/20',
										isToday(day) && 'bg-primary/5'
									)}
								>
									{dayEvents.length === 0 && (
										<button
											onClick={(e) => {
												e.stopPropagation()
												handleAddEvent(day, time, setEditingEvent, setSelectedDate, setSelectedTime, setDialogOpen)
											}}
											className="opacity-0 ml-auto w-fit group-hover/time:opacity-100 p-1 hover:bg-secondary rounded-full transition-opacity"
										>
											<Plus className="size-5 pl-px text-muted-foreground" />
										</button>
									)}
									{dayEvents.map((event) => (
										<EventCard event={event} key={event.id} />
									))}
								</div>
							)
						})}
					</Fragment>
				))}
			</div>
		</div>
	)
}

export { WeekGrid }

