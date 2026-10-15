import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { WorkspaceHeader } from '@/modules/core/components/workspace-Header'
import { type KanbanCard } from '@/types/kanban-types'
import { type Project, projectStatusConfig } from '@/types/project-types'
import { calculateDuration, formatDuration, formatTimeRange } from '@/types/timetrack-types'
import { Calendar, ChevronLeft, ChevronRight, Clock, Plus, Timer } from 'lucide-react'
import { TimeEntryDialog } from './time-entry-dialog'
import { DayGrid } from './dayGrid'
import useTimeTracker from '../hooks/useTimetracker'
import { WeekGrid } from 'src/modules/calendarBoard/components/weekGrid/weekGrid'
import { Activity } from 'react'


export const sampleProjects: Project[] = [
	{
		id: 'proj-1',
		name: 'Website Redesign',
		status: 'in_progress',
		priority: 'high',
		startDate: new Date(),
		deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 'proj-2',
		name: 'Mobile App MVP',
		status: 'planning',
		priority: 'urgent',
		startDate: new Date(),
		deliveryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
		createdAt: new Date(),
		updatedAt: new Date()
	}
]

export const sampleKanbanCards: KanbanCard[] = [
	{ id: 'card-1', title: 'Design homepage mockup', type: 'task', createdAt: new Date() },
	{ id: 'card-2', title: 'API integration research', type: 'idea', createdAt: new Date() },
	{ id: 'card-3', title: 'User feedback analysis', type: 'data', createdAt: new Date() }
]

export function TimetrackBoard() {
	const { viewMode, currentDate,
		 todayTotalMinutes, weekTotalMinutes,
		  getWeekDates,
		   isToday, formatShortDate, formatDateHeader,
		    navigateDate, goToToday, handleAddEntry,
			setCurrentDate,
			getProjectById,
			dialogOpen, setDialogOpen,
			handleEditEntry,
			handleSaveEntry,
			editEntry, setEditEntry,
			initialStartTime, initialEndTime,
			handleDeleteEntry,
			todayEntries,
			setViewMode,
			projects, kanbanCards,
		 } = useTimeTracker()
	

	return (
		<div className="h-full flex-1 px-4 flex flex-col">
			<WorkspaceHeader>
				<WorkspaceHeader.Content 
					title="Time Tracker" 
					description={'log spent hours'} 
					Icon={Clock}
				>
					<WorkspaceHeader.Tabs>
						<WorkspaceHeader.Tab 
							text="day" 
							isActive={viewMode} 
							onClick={
								() => setViewMode('day')
							} 
						/>
						<WorkspaceHeader.Tab 
							text="week" 
							isActive={viewMode} 
							onClick={
								() => setViewMode('week')
							} 
						/>
					</WorkspaceHeader.Tabs>
				</WorkspaceHeader.Content>
				<WorkspaceHeader.Actions>
					<div className="flex items-center gap-2 bg-border px-3 py-1.5 rounded-lg">
						<Timer className="size-4 text-muted-foreground" />
						<span className="text-sm text-muted-foreground">{viewMode === 'day' ? 'Today:' : 'This week:'}</span>
						<span className="font-semibold text-accent/40">
							{formatDuration(viewMode === 'day' ? todayTotalMinutes : weekTotalMinutes)}
						</span>
					</div>
					<WorkspaceHeader.Button 
						text="Add Entry" 
						onClick={
							() => handleAddEntry()
						} 
					/>
				</WorkspaceHeader.Actions>
			</WorkspaceHeader>

			<div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/50">
				<div className="flex items-center gap-2">
					<Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
						<ChevronLeft className="size-4" />
					</Button>
					<Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
						<ChevronRight className="size-4" />
					</Button>
					<Button variant="ghost" size="sm" onClick={goToToday}>
						Today
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<Calendar className="size-4 text-muted-foreground" />
					<span className="font-medium">
						{viewMode === 'day'
							? formatDateHeader(currentDate)
							: `${formatShortDate(getWeekDates[0])} - ${formatShortDate(getWeekDates[6])}`}
					</span>
					{isToday(currentDate) && viewMode === 'day' && (
						<Badge variant="secondary" className="ml-2">
							Today
						</Badge>
					)}
				</div>
				<div className="w-32" />
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
