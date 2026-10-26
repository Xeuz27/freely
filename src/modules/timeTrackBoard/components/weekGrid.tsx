import { calculateDuration, formatDuration, formatTimeRange } from 'src/types/timetrack-types'
import useTimeTrackContext from '../hooks/useTimeTrackContext'
import { cn } from 'src/lib/utils'
import { Clock } from 'lucide-react'
import { projectStatusConfig } from 'src/types/project-types'
import useTimeLogger from '../hooks/useTimeLogger'
import { formatShortDate } from '@/modules/calendarBoard/utils/formatters'
import { Button } from 'src/components/ui/button'
import useHandlers from '../hooks/useHandlers'
import { isToday } from 'src/modules/calendarBoard/utils/isToday'

export const WeekGrid = () => {
	const { getWeekDates, setInitialDate } = useTimeTrackContext()
	const { getEntriesForDate } = useTimeLogger()
	const { handleAddEntry, handleEditEntry, getProjectById } = useHandlers()

	return (
		<div className="p-6">
			<div className="grid grid-cols-7 gap-4">
				{getWeekDates.map((date) => {
					const dayEntries = getEntriesForDate(date)
					const dayTotal = dayEntries.reduce((acc, e) => acc + calculateDuration(e.startTime, e.endTime), 0)
					return (
						<div
							key={date.toISOString()}
							className={cn(
								'border-border overflow-hidden rounded-lg border',
								isToday(date) && 'border-primary/50 ring-primary/20 ring-1'
							)}
						>
							<div className={cn('px-3 py-2', isToday(date) ? 'bg-primary/10' : 'bg-card')}>
								<div className="text-accent-foreground flex items-center justify-between text-sm font-medium">
									<p className="inline-block text-sm">
										{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}{' '}
										{formatShortDate(date)}
									</p>{' '}
									{dayTotal > 0 && (
										<span>
											{formatDuration(dayTotal)} <Clock className="inline-block size-4" />
										</span>
									)}
								</div>
							</div>
							<div className="bg-background flex max-h-75 min-h-37.5 flex-col justify-between space-y-1 overflow-y-auto p-2">
								{dayEntries.map((entry) => {
									const project = getProjectById(entry.projectId)
									return (
										<button
											key={entry.id}
											onClick={() => handleEditEntry(entry)}
											className={cn(
												'w-full rounded px-2 py-1.5 text-left text-xs transition-colors',
												project
													? projectStatusConfig[project.status].color
													: 'bg-secondary hover:bg-secondary/80'
											)}
										>
											<div className="truncate font-medium">{entry.title}</div>
											<div className="text-muted-foreground">
												{formatTimeRange(entry.startTime, entry.endTime)}
											</div>
										</button>
									)
								})}
								{dayEntries.length === 0 && (
									<div className="text-muted-foreground flex h-20 items-center justify-center text-xs">
										No entries
									</div>
								)}
								<Button
									variant={'secondary'}
									onClick={() => {
										setInitialDate(date)
										handleAddEntry()
									}}
									className="bg-sidebar-primary-foreground/10 border-sidebar-primary-foreground"
								>
									Add Entry +{' '}
								</Button>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
