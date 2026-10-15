import { calculateDuration, formatDuration, formatTimeRange } from "src/types/timetrack-types"
import useTimeTracker from "../hooks/useTimetracker"
import { cn } from "src/lib/utils"
import { Plus } from "lucide-react"
import { projectStatusConfig } from "src/types/project-types"

export const weekGrid = () => {
    const { getWeekDates, getEntriesForDate, isToday, formatShortDate, handleAddEntry, setCurrentDate, getProjectById, handleEditEntry } = useTimeTracker()
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
                                'rounded-lg border border-border overflow-hidden',
                                isToday(date) && 'border-primary/50 ring-1 ring-primary/20'
                            )}
                        >
                            <div className={cn('px-3 py-2 border-b border-border', isToday(date) ? 'bg-primary/10' : 'bg-card')}>
                                <div className="flex items-center justify-between">
                                    <span className={cn('text-sm font-medium', isToday(date) && 'text-primary')}>
                                        {formatShortDate(date)}
                                    </span>
                                    <button
                                        onClick={() => {
                                            setCurrentDate(date)
                                            handleAddEntry()
                                        }}
                                        className="size-5 flex items-center justify-center rounded hover:bg-secondary"
                                    >
                                        <Plus className="size-3" />
                                    </button>
                                </div>
                                {dayTotal > 0 && <div className="text-xs text-muted-foreground mt-1">{formatDuration(dayTotal)}</div>}
                            </div>
                            <div className="p-2 space-y-1 min-h-37.5 max-h-75 overflow-y-auto bg-background">
                                {dayEntries.map((entry) => {
                                    const project = getProjectById(entry.projectId)
                                    return (
                                        <button
                                            key={entry.id}
                                            onClick={() => handleEditEntry(entry)}
                                            className={cn(
                                                'w-full text-left px-2 py-1.5 rounded text-xs transition-colors',
                                                project ? projectStatusConfig[project.status].color : 'bg-secondary hover:bg-secondary/80'
                                            )}
                                        >
                                            <div className="font-medium truncate">{entry.title}</div>
                                            <div className="text-muted-foreground">{formatTimeRange(entry.startTime, entry.endTime)}</div>
                                        </button>
                                    )
                                })}
                                {dayEntries.length === 0 && (
                                    <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">No entries</div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}