import { cn } from '@/lib/utils'
import { addHour } from '@formkit/tempo'
import { Plus } from 'lucide-react'
import { Fragment } from 'react'
import useCalendarContext from '../../hooks/useCalendarContext'
import { useWeekEvents } from '../../hooks/useWeekEvents'
import { isToday } from '../../utils/isToday'
import EventCard from '../event-card'
import { DayLabel } from './dayLabel'

const WeekGrid = () => {
	const { currentDate, setSelectedDate, setSelectedTime, setDialogOpen } = useCalendarContext()
	const { weekDays, eventsHourDay } = useWeekEvents(currentDate)
	return (
		<div className="h-full overflow-y-hidden pb-8">
			<div className="grid grid-cols-8 gap-0.5 mb-px">
				<div className="py-2 text-center text-sm font-medium text-muted-foreground" />
				{weekDays.map((day) => (
					<DayLabel key={day.toISOString()} day={day} />
				))}
			</div>
			<div className="grid grid-cols-8 gap-0.5 bg-background/10 rounded-lg h-full pb-8 overflow-y-auto">
				{Object.entries(eventsHourDay).map(([time, events]) => {
					return (
						<Fragment key={`row-${time}`}>
							<div key={`time-${time}`} className="py-4 px-2 text-xs text-muted-foreground text-right bg-card/60">{time}</div>
							{events.map(({ day, event }) => {
								return (
									<div
										key={`${day}-${time}`}
										className={cn(
											'min-h-15 bg-card/40 p-1 gap-2 flex flex-col group/time cursor-pointer border border-transparent',
											day !== null ? '' : 'hover:bg-background/40 hover:border-accent/20',
											isToday(new Date(addHour(day, 4))) && 'bg-primary/5'
										)}
										onClick={(e) => {
											if (event !== null) return
											let target = e.target as HTMLDivElement
											let btn = target.querySelector('button')
											btn!.click()
										}}
									>
										{event === null && event !== undefined ? (
											<button
												onClick={(e) => {
													e.stopPropagation()
													setSelectedTime(time)
													setSelectedDate(new Date(day))
													setDialogOpen(true)
												}}
												className="opacity-0 ml-auto w-fit group-hover/time:opacity-100 p-1 hover:bg-secondary rounded-full transition-opacity"
											>
												<Plus className="size-5 pl-px text-muted-foreground" />
											</button>
										) : (
											<EventCard event={event} key={event.id} />
										)}
									</div>
								)
							})}
						</Fragment>
					)
				})}
			</div>
		</div>
	)
}

export { WeekGrid }
