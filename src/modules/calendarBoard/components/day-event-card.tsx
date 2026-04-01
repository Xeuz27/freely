import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { eventTypeConfig, type CalendarEvent } from '@/types/calendar-types'
import { AlertCircle, Bell, CheckSquare, Clock, Edit2, Link2, MoreHorizontal, Phone, Trash2, Users } from 'lucide-react'
import useCalendarContext from '../hooks/useCalendarContext'
import { handleDeleteEvent, handleEditEvent } from '../utils/handlers'

const DayEventCard = ({ event }: { event: CalendarEvent }) => {
	const { setEditingEvent, setEvents, setSelectedDate, setSelectedTime } = useCalendarContext()

	return (
		<div
			className={cn(
				'group flex items-start gap-3 p-3 rounded-lg border text-sm cursor-pointer transition-all hover:scale-[1.01]',
				eventTypeConfig[event.type].color
			)}
		>
			<div className={cn('flex items-center justify-center size-10 rounded-lg shrink-0', 'bg-white/10')}>
				{event.type === 'meeting' && <Users className="size-5" />}
				{event.type === 'call' && <Phone className="size-5" />}
				{event.type === 'task' && <CheckSquare className="size-5" />}
				{event.type === 'reminder' && <Bell className="size-5" />}
				{event.type === 'deadline' && <AlertCircle className="size-5" />}
			</div>
			<div className="flex-1 min-w-0">
				<p className="font-semibold truncate">{event.title}</p>
				{event.startTime && (
					<div className="flex items-center gap-1.5 mt-1 text-xs opacity-80">
						<Clock className="size-3" />
						<span>
							{event.startTime}
							{event.endTime && ` - ${event.endTime}`}
						</span>
					</div>
				)}
				{event.description && <p className="text-xs opacity-70 mt-1 truncate">{event.description}</p>}
				{(event.leadName || event.kanbanCardTitle) && (
					<div className="flex items-center gap-1.5 mt-2">
						<Link2 className="size-3 opacity-50" />
						<span className="text-xs opacity-70 truncate">{event.leadName || event.kanbanCardTitle}</span>
					</div>
				)}
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-opacity">
						<MoreHorizontal className="size-4" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => handleEditEvent(event, setEditingEvent, setSelectedDate, setSelectedTime)}>
						<Edit2 className="size-4 mr-2" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleDeleteEvent(event.id, setEvents)} className="text-red-400">
						<Trash2 className="size-4 mr-2" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export { DayEventCard }
