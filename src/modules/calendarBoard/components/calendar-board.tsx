import { Button } from '@/components/ui/button'
import { sampleKanbanCards } from '@/data/sampleKanbanCards'
import { sampleLeads } from '@/data/sampleLeads'
import { WorkspaceHeader } from '@/modules/core/components/workspace-Header'
import { type EventType } from '@/types/calendar-types.ts'
import { type Lead } from '@/types/crm-types'
import { type KanbanCard } from '@/types/kanban-types'
import {
	AlertCircle,
	Bell,
	CalendarDays,
	CheckSquare,
	ChevronLeft,
	ChevronRight,
	Phone,
	Users,
	type LucideIcon
} from 'lucide-react'
import { Activity } from 'react'
import useCalendarContext from '../hooks/useCalendarContext'
import useCalendarHandlers from '../hooks/useCalendarHandlers'
import { useEventReminders } from '../hooks/useEventReminders'
import { formatDateHeader } from '../utils/formatters'
import { DayGrid } from './dayGrid/dayGrid'
import { EventDialog } from './event-dialog'
import { MonthGrid } from './monthGrid'
import { WeekGrid } from './weekGrid/weekGrid'

export const eventTypeIcons: Record<EventType, LucideIcon> = {
	meeting: Users,
	call: Phone,
	task: CheckSquare,
	reminder: Bell,
	deadline: AlertCircle
}

interface CalendarBoardProps {
	leads?: Lead[]
	kanbanCards?: KanbanCard[]
}

const Grid = () => {
	const { currentDate, month, year, view, setCurrentDate, setView } = useCalendarContext()
	const { handleNext, handlePrev } = useCalendarHandlers()

	return (
		<>
			<div className="border-border border-b py-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" onClick={handlePrev}>
							<ChevronLeft className="size-4" />
						</Button>
						<h2 className="text-center text-lg font-semibold lg:min-w-70">
							{formatDateHeader(currentDate, view, month, year)}
						</h2>
						<Button variant="ghost" size="icon" onClick={handleNext}>
							<ChevronRight className="size-4" />
						</Button>
					</div>
					<Button
						variant="default"
						className="bg-accent/10 hover:bg-accent/20"
						size="sm"
						onClick={() => {
							setCurrentDate(new Date())
							if (view !== 'day') setView('day')
						}}
					>
						Today
					</Button>
				</div>
			</div>

			<div className="relative h-full flex-1 overflow-y-hidden pb-8">
				<Activity mode={view === 'month' ? 'visible' : 'hidden'}>
					<MonthGrid />
				</Activity>
				<Activity mode={view === 'week' ? 'visible' : 'hidden'}>
					<WeekGrid />
				</Activity>
				<Activity mode={view === 'day' ? 'visible' : 'hidden'}>
					<DayGrid />
				</Activity>
			</div>
		</>
	)
}

export function CalendarBoard({ leads = sampleLeads, kanbanCards = sampleKanbanCards }: CalendarBoardProps) {
	const { view, setView, selectedTime, selectedDate, editingEvent, dialogOpen, setDialogOpen } = useCalendarContext()
	const { handleAddEvent } = useCalendarHandlers()
	useEventReminders()

	return (
		<div className="flex h-screen flex-1 flex-col overflow-hidden px-4">
			<WorkspaceHeader>
				<WorkspaceHeader.Content
					title="Calendar"
					description="Schedule meetings and track deadlines"
					Icon={CalendarDays}
				/>
				<WorkspaceHeader.Actions>
					<div className="max-lg:hidden">
						<WorkspaceHeader.Tabs>
							<WorkspaceHeader.Tab text="month" onClick={() => setView('month')} isActive={view} />
							<WorkspaceHeader.Tab
								text="week"
								onClick={() => setView('week')}
								className=""
								isActive={view}
							/>
							<WorkspaceHeader.Tab text="day" onClick={() => setView('day')} isActive={view} />
						</WorkspaceHeader.Tabs>
					</div>

					<WorkspaceHeader.Button text="Add Event" onClick={() => handleAddEvent()} />
				</WorkspaceHeader.Actions>
			</WorkspaceHeader>
			<WorkspaceHeader.Tabs className="my-2.5 lg:hidden">
				<WorkspaceHeader.Tab className="w-full" text="day" onClick={() => setView('day')} isActive={view} />

				<WorkspaceHeader.Tab
					className="w-full max-md:hidden"
					text="week"
					onClick={() => setView('week')}
					isActive={view}
				/>

				<WorkspaceHeader.Tab text="month" className="w-full" onClick={() => setView('month')} isActive={view} />
			</WorkspaceHeader.Tabs>

			<Grid />
			{dialogOpen && (
				<EventDialog
					onOpenChange={setDialogOpen}
					editEvent={editingEvent}
					initialDate={selectedDate}
					initialTime={selectedTime}
					leads={leads}
					kanbanCards={kanbanCards}
				/>
			)}
		</div>
	)
}
