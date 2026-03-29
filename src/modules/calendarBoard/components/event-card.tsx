import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { type CalendarEvent, eventTypeConfig } from '@/types/calendar-types'
import { Edit2, Link2, MoreHorizontal, Trash2 } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { handleDeleteEvent, handleEditEvent } from '../utils/handlers'
import { eventTypeIcons } from './calendar-board'

const EventCard = ({
	event,
	setEvents,
	compact,
	key,
	setEditingEvent,
	setSelectedDate,
	setSelectedTime,
	setDialogOpen
}: {
	event: CalendarEvent
	setEvents?: Dispatch<SetStateAction<CalendarEvent[]>>
	setEditingEvent?: Dispatch<SetStateAction<CalendarEvent | null>>
	setSelectedDate?: Dispatch<SetStateAction<Date | null>>
	setSelectedTime?: Dispatch<SetStateAction<string | undefined>>

	setDialogOpen?: Dispatch<SetStateAction<boolean>>

	compact?: boolean
	key: string
}) => {
	return (
		<div
			key={key}
			className={cn(
				'group flex items-start gap-1.5 p-1.5 rounded-md border text-xs cursor-pointer transition-colors',
				event.type ? eventTypeConfig[event.type].color : ''
			)}
		>
			<span className="mt-0.5 shrink-0">{eventTypeIcons[event.type]}</span>
			<div className="flex-1 min-w-0">
				<p className="font-medium truncate">{event.title}</p>
				{!compact && event.startTime && (
					<p className="text-[10px] opacity-70">
						{event.startTime}
						{event.endTime && ` - ${event.endTime}`}
					</p>
				)}
				{!compact && (event.leadName || event.kanbanCardTitle) && (
					<div className="flex items-center gap-1 mt-0.5">
						<Link2 className="size-2.5 opacity-50" />
						<span className="text-[10px] opacity-70 truncate">{event.leadName || event.kanbanCardTitle}</span>
					</div>
				)}
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded transition-opacity">
						<MoreHorizontal className="size-3" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => handleEditEvent(event, setEditingEvent, setSelectedDate, setSelectedTime, setDialogOpen)}>
						<Edit2 className="size-3 mr-2" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleDeleteEvent(event.id, setEvents)} className="text-red-400">
						<Trash2 className="size-3 mr-2" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default EventCard
