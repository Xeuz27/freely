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
			<div className="mb-px grid grid-cols-8 gap-0.5">
				<div className="text-muted-foreground py-2 text-center text-sm font-medium" />
				{weekDays.map((day) => (
					<DayLabel key={day.toISOString()} day={day} />
				))}
			</div>
			<div className="bg-background/10 grid h-full grid-cols-8 gap-0.5 overflow-y-auto rounded-lg pb-8">
				{Object.entries(eventsHourDay).map(([time, events]) => {
					return (
						<Fragment key={`row-${time}`}>
							<div
								key={`time-${time}`}
								className="text-muted-foreground bg-card/60 px-2 py-4 text-right text-xs"
							>
								{time}
							</div>
							{events.map(({ day, event }) => {
								return (
									<div
										key={`${day}-${time}`}
										className={cn(
											'bg-card/40 group/time flex min-h-15 cursor-pointer flex-col gap-2 border border-transparent p-1',
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
												className="hover:bg-secondary ml-auto w-fit rounded-full p-1 opacity-0 transition-opacity group-hover/time:opacity-100"
											>
												<Plus className="text-muted-foreground size-5 pl-px" />
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
