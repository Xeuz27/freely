import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { type CalendarEvent, eventTypeConfig } from '@/types/calendar-types'
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react'
import useCalendarContext from '../hooks/useCalendarContext'
import { handleDeleteEvent } from '../utils/handlers'
import { eventTypeIcons } from './calendar-board'

const EventCard = ({ event, compact }: { event: CalendarEvent; compact?: boolean }) => {
	const { setEditingEvent, setSelectedDate, setSelectedTime, setDialogOpen } = useCalendarContext()
	return (
		<div
			key={event.id}
			className={cn(
				'group flex items-start gap-1.5 p-1.5 rounded-md border text-xs hover:scale-[1.02]  transition-all cursor-pointer',
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
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded transition-opacity">
						<MoreHorizontal className="size-3" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onClick={() => {
							setEditingEvent(event)
							setSelectedDate(undefined)
							setSelectedTime(undefined)
							setDialogOpen(true)
						}}
					>
						<Edit2 className="size-3 mr-2" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleDeleteEvent(event)} className="text-red-400">
						<Trash2 className="size-3 mr-2" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default EventCard
