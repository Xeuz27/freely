import { cn } from '@/lib/utils'
import { Fragment } from 'react'
import useCalendar from '../hooks/useCalendar'
import { handleAddEvent } from '../utils/handlers'
import { isToday } from '../utils/isToday'
import EventCard from './event-card'

const WeekGrid = () => {
	const { getWeekDays, setCurrentDate, setView, getEventsForDate, setEvents } = useCalendar()

	return (
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
										<EventCard event={event} setEvents={setEvents} key={event.id} />
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
