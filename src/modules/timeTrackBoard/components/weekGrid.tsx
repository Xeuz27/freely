import { calculateDuration, formatDuration, formatTimeRange } from 'src/types/timetrack-types'
import useTimeTrackContext from '../hooks/useTimeTrackContext'
import { cn } from 'src/lib/utils'
import { Plus } from 'lucide-react'
import { projectStatusConfig } from 'src/types/project-types'
import useTimeLogger from '../hooks/useTimeLogger'

export const WeekGrid = () => {
	const {
		getWeekDates,
		currentDate,
		isToday,
		formatShortDate,
		handleAddEntry,
		setCurrentDate,
		getProjectById,
		handleEditEntry
	} = useTimeTrackContext()
	const { getEntriesForDate } = useTimeLogger(currentDate)
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
							<div
								className={cn(
									'border-border border-b px-3 py-2',
									isToday(date) ? 'bg-primary/10' : 'bg-card'
								)}
							>
								<div className="flex items-center justify-between">
									<span className={cn('text-sm font-medium', isToday(date) && 'text-primary')}>
										{formatShortDate(date)}
									</span>
									<button
										onClick={() => {
											setCurrentDate(date)
											handleAddEntry()
										}}
										className="hover:bg-secondary flex size-5 items-center justify-center rounded"
									>
										<Plus className="size-3" />
									</button>
								</div>
								{dayTotal > 0 && (
									<div className="text-muted-foreground mt-1 text-xs">{formatDuration(dayTotal)}</div>
								)}
							</div>
							<div className="bg-background max-h-75 min-h-37.5 space-y-1 overflow-y-auto p-2">
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
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
