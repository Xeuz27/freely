import { Clock, Plus } from "lucide-react"
import { Button } from "src/components/ui/button"
import { dayTimeSlots } from "src/data/dayTimeSlots"
import { cn } from "src/lib/utils"
import useTimeTracker from "../hooks/useTimetracker"
import { TimeEntryCard } from "./TimeEntryCard"
import { useEffect } from "react"
import type { TimeEntry } from "src/types/timetrack-types"
import useTimeLogger from "../hooks/useTimeLogger"


export const DayGrid = () => {
    const {  handleAddEntry, currentDate } = useTimeTracker()
    const {getEntriesForDate} = useTimeLogger(currentDate)
    const todayEntries = getEntriesForDate(currentDate)

    useEffect(()=> {
        console.group()
        console.log('daygrid')
        console.log(currentDate)
        console.log(todayEntries)
        console.groupEnd()
    }, [])
    return (
        <div className="flex h-full">
            <div className="flex-1 p-6">
                <div className="space-y-3">
                    {todayEntries.length > 0 ? (
                        todayEntries.map((entry) => <TimeEntryCard key={entry.id} entry={entry} />)
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <Clock className="size-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium">No time logged yet</p>
                            <p className="text-sm">Start tracking your day</p>
                            <Button variant="outline" className="mt-4" onClick={() => handleAddEntry()}>
                                <Plus className="size-4 mr-2" />
                                Log your first entry
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <aside className="w-64 border-l border-border p-4 bg-card/30">
                <h3 className="font-medium mb-4 text-sm text-muted-foreground uppercase tracking-wide">Quick Add</h3>
                <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {dayTimeSlots.map((time, index) => {
                        const nextTime = dayTimeSlots[index + 1]
                        const hasEntry = todayEntries.some((e) => (e.startTime <= time && e.endTime > time) || e.startTime === time)
                        return (
                            <button
                                key={time}
                                onClick={() => nextTime && handleAddEntry(time, nextTime)}
                                disabled={!nextTime}
                                className={cn(
                                    'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left',
                                    hasEntry
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                                )}
                            >
                                <span className="font-mono text-xs w-12">{time}</span>
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

