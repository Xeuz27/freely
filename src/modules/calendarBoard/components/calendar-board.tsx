import { Button } from '@/components/ui/button'
import { sampleKanbanCards } from '@/data/sampleKanbanCards'
import { sampleLeads } from '@/data/sampleLeads'
import { WorkspaceHeader } from '@/modules/core/components/workspace-Header'
import { type EventType } from '@/types/calendar-types.ts'
import { type Lead } from '@/types/crm-types'
import { type KanbanCard } from '@/types/kanban-types'
import { AlertCircle, Bell, CalendarDays, CheckSquare, ChevronLeft, ChevronRight, Phone, Users } from 'lucide-react'
import { Activity } from 'react'
import useCalendarContext from '../hooks/useCalendarContext'
import { useEventReminders } from '../hooks/useEventReminders'
import { formatDateHeader } from '../utils/formatDateHeader'
import { handleNext, handlePrev } from '../utils/handlers'
import { DayGrid } from './dayGrid/dayGrid'
import { EventDialog } from './event-dialog'
import { MonthGrid } from './monthGrid'
import { WeekGrid } from './weekGrid/weekGrid'

export const eventTypeIcons: Record<EventType, React.ReactNode> = {
	meeting: <Users className="size-3" />,
	call: <Phone className="size-3" />,
	task: <CheckSquare className="size-3" />,
	reminder: <Bell className="size-3" />,
	deadline: <AlertCircle className="size-3" />
}

interface CalendarBoardProps {
	leads?: Lead[]
	kanbanCards?: KanbanCard[]
}

const Grid = () => {
	const { days, year, currentDate, setCurrentDate, month, view, setView } = useCalendarContext()

	return (
		<>
			<div className="py-3 border-b border-border">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" onClick={() => handlePrev(view, year, month, currentDate, setCurrentDate)}>
							<ChevronLeft className="size-4" />
						</Button>
						<h2 className="text-lg font-semibold lg:min-w-70  text-center">{formatDateHeader(view, currentDate, month, year)}</h2>
						<Button variant="ghost" size="icon" onClick={() => handleNext(view, currentDate, setCurrentDate, year, month)}>
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

			<div className="flex-1 overflow-auto relative">
				<Activity mode={view === 'month' ? 'visible' : 'hidden'}>
					<MonthGrid days={days} />
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
	const { view, setView, selectedTime, setEditingEvent, selectedDate, setDialogOpen, editingEvent, dialogOpen } = useCalendarContext()
	useEventReminders()
	console.log('CalendarBoard rendered')
	return (
		<div className="flex flex-1 flex-col h-screen px-4">
			<WorkspaceHeader>
				<WorkspaceHeader.Content title="Calendar" description="Schedule meetings and track deadlines" Icon={CalendarDays} />
				<WorkspaceHeader.Actions>
					<div className="max-lg:hidden">
						<WorkspaceHeader.Tabs>
							<WorkspaceHeader.Tab text="month" onClick={() => setView('month')} isActive={view} />
							<WorkspaceHeader.Tab text="week" onClick={() => setView('week')} className="" isActive={view} />
							<WorkspaceHeader.Tab text="day" onClick={() => setView('day')} isActive={view} />
						</WorkspaceHeader.Tabs>
					</div>

					<WorkspaceHeader.Button
						text="Add Event"
						onClick={() => {
							setEditingEvent(undefined)
							setDialogOpen(true)
						}}
					/>
				</WorkspaceHeader.Actions>
			</WorkspaceHeader>
			<WorkspaceHeader.Tabs className="lg:hidden my-2.5">
				<WorkspaceHeader.Tab className="w-full" text="day" onClick={() => setView('day')} isActive={view} />

				<WorkspaceHeader.Tab className="w-full max-md:hidden" text="week" onClick={() => setView('week')} isActive={view} />

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
