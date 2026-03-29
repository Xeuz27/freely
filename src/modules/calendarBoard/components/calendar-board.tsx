import { Button } from '@/components/ui/button'
import { sampleKanbanCards } from '@/data/sampleKanbanCards'
import { sampleLeads } from '@/data/sampleLeads'
import { cn } from '@/lib/utils'
import { EventDialog } from '@/modules/calendarBoard/components/event-dialog'
import { type EventType } from '@/types/calendar-types.ts'
import { type Lead } from '@/types/crm-types'
import { type KanbanCard } from '@/types/kanban-types'
import { AlertCircle, Bell, CalendarDays, CheckSquare, ChevronLeft, ChevronRight, Phone, Plus, Users } from 'lucide-react'
import useCalendar from '../hooks/useCalendar'
import { handleAddEvent, handleNext, handlePrev, handleSaveEvent } from '../utils/handlers'
import { DayGrid } from './dayGrid'
import MonthGrid from './monthGrid'
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
		getEventsForDate,
		editingEvent,
		dialogOpen,
		formatDateHeader
	} = useCalendar()

	return (
		<div className="flex flex-col h-screen bg-background">
			<header className="flex items-center justify-between px-6 py-4 border-b border-border">
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
						<button
							onClick={() => setView('month')}
							className={cn(
								'px-3 py-1.5 text-sm rounded-md transition-colors',
								view === 'month' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
							)}
						>
							Month
						</button>
						<button
							onClick={() => setView('week')}
							className={cn(
								'px-3 py-1.5 text-sm rounded-md transition-colors',
								view === 'week' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
							)}
						>
							Week
						</button>
						<button
							onClick={() => {
								setView('day')
								setCurrentDate(new Date())
							}}
							className={cn(
								'px-3 py-1.5 text-sm rounded-md transition-colors',
								view === 'day' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
							)}
						>
							Day
						</button>
					</div>
					<Button
						onClick={() => handleAddEvent(new Date(), selectedTime, setEditingEvent, setSelectedDate, setSelectedTime, setDialogOpen)}
					>
						<Plus className="size-4 mr-1" />
						Add Event
					</Button>
				</div>
			</header>

			<div className="px-6 py-3 border-b border-border">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" onClick={() => handlePrev(view, year, month, currentDate, setCurrentDate)}>
							<ChevronLeft className="size-4" />
						</Button>
						<h2 className="text-lg font-semibold min-w-[280px] text-center">{formatDateHeader()}</h2>
						<Button variant="ghost" size="icon" onClick={() => handleNext(view, currentDate, setCurrentDate, year, month)}>
							<ChevronRight className="size-4" />
						</Button>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							setCurrentDate(new Date())
							if (view === 'day') setView('day')
						}}
					>
						Today
					</Button>
				</div>
			</div>

			<div className="flex-1 overflow-auto p-6">
				{view === 'month' ? (
					<MonthGrid days={days} getEventsForDate={getEventsForDate} setCurrentDate={setCurrentDate} setView={setView} />
				) : view === 'week' ? (
					<WeekGrid />
				) : (
					<DayGrid />
				)}
			</div>

			<EventDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onSave={handleSaveEvent}
				editEvent={editingEvent}
				initialDate={selectedDate || undefined}
				initialTime={selectedTime}
				leads={leads}
				kanbanCards={kanbanCards}
			/>
		</div>
	)
}
