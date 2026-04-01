import { Button } from '@/components/ui/button'
import { sampleKanbanCards } from '@/data/sampleKanbanCards'
import { sampleLeads } from '@/data/sampleLeads'
import { cn } from '@/lib/utils'
import { WorkspaceHeader } from '@/modules/core/components/workspace-Header'
import { type EventType } from '@/types/calendar-types.ts'
import { type Lead } from '@/types/crm-types'
import { type KanbanCard } from '@/types/kanban-types'
import { AlertCircle, Bell, CalendarDays, CheckSquare, ChevronLeft, ChevronRight, Phone, Plus, Users } from 'lucide-react'
import useCalendarContext from '../hooks/useCalendarContext'
import { formatDateHeader } from '../utils/formatDateHeader'
import { handleAddEvent, handleNext, handlePrev, handleSaveEvent } from '../utils/handlers'
import { DayGrid } from './dayGrid'
import { EventDialog } from './event-dialog'
import { MonthGrid } from './monthGrid'
import { WeekGrid } from './weekGrid'

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
const Btn = ({ view, onClick, text }: { view: string; onClick: () => void; text: string }) => {
	return (
		<button
			onClick={() => onClick()}
			className={cn(
				'px-3 py-1.5 text-sm rounded-md transition-colors',
				view === text ? 'bg-background text-foreground shadow-sm border border-accent/30' : 'text-muted-foreground hover:text-foreground'
			)}
		>
			{text}
		</button>
	)
}
export function CalendarBoard({ leads = sampleLeads, kanbanCards = sampleKanbanCards }: CalendarBoardProps) {
	const {
		days,
		year,
		currentDate,
		setCurrentDate,
		month,
		view,
		setView,
		selectedTime,
		setEditingEvent,
		selectedDate,
		setSelectedDate,
		setSelectedTime,
		setDialogOpen,
		editingEvent,
		dialogOpen
	} = useCalendarContext()

	return (
		<div className="flex flex-1 flex-col h-screen px-4">
			<WorkspaceHeader>
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
						<CalendarDays className="size-5 text-primary" />
					</div>
					<div>
						<h1 className="text-lg font-semibold text-foreground">Calendar</h1>
						<p className="text-xs text-muted-foreground">Schedule meetings and track deadlines</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div className="flex items-center bg-secondary/50 rounded-lg p-1">
						<Btn view={view} onClick={() => setView('month')} text="month" />
						<Btn view={view} onClick={() => setView('week')} text="week" />
						<Btn view={view} onClick={() => setView('day')} text="day" />
					</div>
					<Button
						className="hover:bg-accent/20"
						onClick={() => {
							handleAddEvent(new Date(), selectedTime, setEditingEvent, setSelectedDate, setSelectedTime, setDialogOpen)
						}}
					>
						<Plus className="size-4 mr-1" />
						Add Event
					</Button>
				</div>
			</WorkspaceHeader>

			<div className="px-6 py-3 border-b border-border">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" onClick={() => handlePrev(view, year, month, currentDate, setCurrentDate)}>
							<ChevronLeft className="size-4" />
						</Button>
						<h2 className="text-lg font-semibold min-w-[280px] text-center">{formatDateHeader(view, currentDate, month, year)}</h2>
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
				{view === 'month' ? <MonthGrid days={days} /> : view === 'week' ? <WeekGrid /> : <DayGrid />}
			</div>

			{dialogOpen && (
				<EventDialog
					onOpenChange={setDialogOpen}
					onSave={handleSaveEvent}
					editEvent={editingEvent}
					initialDate={selectedDate || undefined}
					initialTime={selectedTime}
					leads={leads}
					kanbanCards={kanbanCards}
				/>
			)}
		</div>
	)
}
