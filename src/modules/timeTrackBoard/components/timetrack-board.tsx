import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { WorkspaceHeader } from '@/modules/core/components/workspace-Header'
import { formatDuration } from '@/types/timetrack-types'
import { Calendar, ChevronLeft, ChevronRight, Clock, Timer } from 'lucide-react'
import { TimeEntryDialog } from './time-entry-dialog'
import { DayGrid } from './dayGrid'
import useTimeTrackContext from '../hooks/useTimeTrackContext'
import { WeekGrid } from 'src/modules/calendarBoard/components/weekGrid/weekGrid'
import { Activity } from 'react'

export function TimetrackBoard() {
	const {
		viewMode,
		currentDate,
		todayTotalMinutes,
		weekTotalMinutes,
		getWeekDates,
		formatShortDate,
		formatDateHeader,
		navigateDate,
		goToToday,
		handleAddEntry,
		dialogOpen,
		setDialogOpen,
		handleSaveEntry,
		editEntry,
		initialStartTime,
		initialEndTime,
		setViewMode,
		projects,
		kanbanCards
	} = useTimeTrackContext()

	return (
		<div className="flex h-full flex-1 flex-col px-4">
			<WorkspaceHeader>
				<WorkspaceHeader.Content title="Time Tracker" description={'log spent hours'} Icon={Clock}>
					<div className="bg-border flex items-center gap-2 rounded-lg px-3 py-1.5">
						<Timer className="text-muted-foreground size-4" />
						<span className="text-muted-foreground text-sm">
							{viewMode === 'day' ? 'Today:' : 'This week:'}
						</span>
						<span className="text-accent/40 font-semibold">
							{formatDuration(viewMode === 'day' ? todayTotalMinutes : weekTotalMinutes)}
						</span>
					</div>
				</WorkspaceHeader.Content>
				<WorkspaceHeader.Actions>
					<WorkspaceHeader.Tabs>
						<WorkspaceHeader.Tab text="day" isActive={viewMode} onClick={() => setViewMode('day')} />
						<WorkspaceHeader.Tab text="week" isActive={viewMode} onClick={() => setViewMode('week')} />
					</WorkspaceHeader.Tabs>
					<WorkspaceHeader.Button text="Add Entry" onClick={() => handleAddEntry()} />
				</WorkspaceHeader.Actions>
			</WorkspaceHeader>

			<div className="border-border flex items-center justify-between border-b py-3">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" onClick={() => navigateDate('prev')}>
						<ChevronLeft className="size-4" />
					</Button>
					<div className="flex items-center gap-2 px-2">
						<span className="text-lg font-semibold">
							{viewMode === 'day'
								? formatDateHeader(currentDate)
								: `${formatShortDate(getWeekDates[0])} - ${formatShortDate(getWeekDates[6])}`}
						</span>
					</div>
					<Button variant="ghost" size="icon" onClick={() => navigateDate('next')}>
						<ChevronRight className="size-4" />
					</Button>
				</div>
				<div className="">
					<Button variant="default" className="bg-accent/10 hover:bg-accent/20" size="sm" onClick={goToToday}>
						Today
					</Button>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto">
				<Activity mode={viewMode === 'day' ? 'visible' : 'hidden'}>
					<DayGrid />
				</Activity>
				<Activity mode={viewMode === 'week' ? 'visible' : 'hidden'}>
					<WeekGrid />
				</Activity>
			</div>

			<TimeEntryDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onSave={handleSaveEntry}
				editEntry={editEntry}
				initialDate={currentDate}
				initialStartTime={initialStartTime}
				initialEndTime={initialEndTime}
				projects={projects}
				kanbanCards={kanbanCards}
			/>
		</div>
	)
}
