import { Clock, Plus } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import { dayTimeSlots } from 'src/data/dayTimeSlots'
import { cn } from 'src/lib/utils'
import useTimeTrackContext from '../hooks/useTimeTrackContext'
import { TimeEntryCard } from './TimeEntryCard'
import useTimeLogger from '../hooks/useTimeLogger'
import { useEffect } from 'react'

export const DayGrid = () => {
	const { handleAddEntry, currentDate } = useTimeTrackContext()
	const { getEntriesForDate } = useTimeLogger(currentDate)
	const todayEntries = getEntriesForDate(currentDate)

	useEffect(() => {
		console.group()
		console.log('daygrid')
		console.log(currentDate)
		console.log(todayEntries)
		console.log(getEntriesForDate(currentDate))
		console.groupEnd()
	}, [])

	return (
		<div className="flex h-full">
			<div className="flex-1 p-6">
				<div className="space-y-3">
					{todayEntries.length > 0 ? (
						todayEntries.map((entry) => <TimeEntryCard key={entry.id} entry={entry} />)
					) : (
						<div className="text-muted-foreground flex flex-col items-center justify-center py-16">
							<Clock className="mb-4 size-12 opacity-50" />
							<p className="text-lg font-medium">No time logged yet</p>
							<p className="text-sm">Start tracking your day</p>
							<Button variant="outline" className="mt-4" onClick={() => handleAddEntry()}>
								<Plus className="mr-2 size-4" />
								Log your first entry
							</Button>
						</div>
					)}
				</div>
			</div>
			<aside className="border-border bg-card/30 w-64 border-l p-4">
				<h3 className="text-muted-foreground mb-4 text-sm font-medium tracking-wide uppercase">Quick Add</h3>
				<div className="max-h-[calc(100vh-300px)] space-y-1 overflow-y-auto">
					{dayTimeSlots.map((time, index) => {
						const nextTime = dayTimeSlots[index + 1]
						const hasEntry = todayEntries.some(
							(e) => (e.startTime <= time && e.endTime > time) || e.startTime === time
						)
						return (
							<button
								key={time}
								onClick={() => nextTime && handleAddEntry(time, nextTime)}
								disabled={!nextTime}
								className={cn(
									'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors',
									hasEntry
										? 'bg-primary/10 text-primary border-primary/20 border'
										: 'hover:bg-secondary text-muted-foreground hover:text-foreground'
								)}
							>
								<span className="w-12 font-mono text-xs">{time}</span>
								{hasEntry ? (
									<span className="text-xs">Logged</span>
								) : (
									<Plus className="size-3 opacity-0 group-hover:opacity-100" />
								)}
							</button>
						)
					})}
				</div>
			</aside>
		</div>
	)
}
