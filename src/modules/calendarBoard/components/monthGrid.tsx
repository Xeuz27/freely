import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import useCalendarContext from '../hooks/useCalendarContext.ts'
import useMonthEvents from '../hooks/useMonthEvents.ts'
import useCalendarHandlers from '../hooks/useCalendarHandlers'
import { isToday } from '../utils/isToday.ts'
import EventCard from './event-card.tsx'

const MonthGrid = () => {
	const monthDays = useMonthEvents()
	const [visibleEventCount, setVisibleEventCount] = useState(1)
	const { setCurrentDate, setView, selectedTime } = useCalendarContext()
	const { handleAddEvent } = useCalendarHandlers()

	useEffect(() => {
		const compactScreen = window.matchMedia('(max-width: 769px)')
		const tinyScreen = window.matchMedia('(max-width: 419px)')
		const updateVisibleEventCount = () => {
			setVisibleEventCount(tinyScreen.matches ? 0 : compactScreen.matches ? 2 : 3)
		}

		updateVisibleEventCount()
		compactScreen.addEventListener('change', updateVisibleEventCount)
		tinyScreen.addEventListener('change', updateVisibleEventCount)

		return () => {
			compactScreen.removeEventListener('change', updateVisibleEventCount)
			tinyScreen.removeEventListener('change', updateVisibleEventCount)
		}
	}, [])

	return (
		<div className="h-full overflow-y-hidden pb-2">
			{/* <div className="w-full hidden">
				<button onClick={() => GenEvents()} className="p-4 border-2 border-red-400 px-8 text-white font-bold text-lg">
					click here!
				</button>
			</div> */}
			<div className="mb-px grid grid-cols-7 gap-px">
				{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
					<div key={day} className="text-muted-foreground py-2 text-center text-sm font-medium">
						{day}
					</div>
				))}
			</div>

			<div className="bg-sidebar/20 grid h-full grid-cols-7 gap-0.5 overflow-y-auto pb-8">
				{monthDays.map(({ day, events: dayEvents }, idx) => {
					if (!day) {
						return <div key={`empty-${idx}`} className="bg-card/5 min-h-48" />
					}
					const isCurrentDay = isToday(day)

					return (
						<div
							key={day.toISOString()}
							className={cn(
								'bg-card/40 group/day hover:border-accent/30 hover:bg-background/10 min-h-48 border border-transparent p-2 transition-colors',
								isCurrentDay && 'bg-primary/20'
							)}
						>
							<div className="mb-4 flex items-center justify-between">
								<button
									onClick={() => {
										setCurrentDate(day)
										setView('day')
									}}
									className={cn(
										'hover:bg-primary/60 inline-flex size-6 items-center justify-center rounded-full text-sm transition-colors max-md:size-4 max-md:p-2',
										isCurrentDay
											? 'bg-primary text-primary-foreground font-semibold'
											: 'text-foreground'
									)}
								>
									{day.getDate()}
								</button>
								<button
									onClick={() => {
										handleAddEvent(day, selectedTime)
									}}
									className="hover:bg-secondary rounded-full p-1 opacity-0 transition-opacity group-hover/day:opacity-100 max-md:hidden"
								>
									<Plus className="text-muted-foreground size-5 pl-px" />
								</button>
							</div>
							<div className="space-y-1">
								{dayEvents.slice(0, visibleEventCount).map((event) => (
									<div key={event.id}>
										<EventCard event={event} compact />
									</div>
								))}
								{dayEvents.length > visibleEventCount && (
									<p className="text-muted-foreground pt-1 text-xs">
										+{dayEvents.length - visibleEventCount} more
									</p>
								)}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export { MonthGrid }
