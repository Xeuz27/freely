import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { type CalendarEvent, eventTypeConfig } from '@/types/calendar-types'
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react'
import useCalendarContext from '../hooks/useCalendarContext'
import { handleDeleteEvent } from '../utils/handlers'
import { eventTypeIcons } from './calendar-board'

const EventCard = ({ event, compact }: { event: CalendarEvent; compact?: boolean }) => {
	const { setEditingEvent, setSelectedDate, setSelectedTime, setDialogOpen } = useCalendarContext()
	const EventIcon = eventTypeIcons[event.type]
	return (
		<div
			key={event.id}
			className={cn(
				'group flex cursor-pointer items-center justify-center gap-1.5 rounded-md border p-1.5 text-xs transition-all hover:scale-[1.02]',
				event.type ? eventTypeConfig[event.type].color : ''
			)}
		>
			<span className="mt-0.5 shrink-0">
				<EventIcon className="size-3" />
			</span>
			<div className="min-w-0 flex-1 max-sm:hidden">
				<p className="max-w-28 truncate font-medium">{event.title}</p>
				{!compact && event.startTime && (
					<p className="text-[10px] opacity-70">
						{event.startTime}
						{event.endTime && ` - ${event.endTime}`}
					</p>
				)}
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/10 max-sm:hidden">
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
						<Edit2 className="mr-2 size-3" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleDeleteEvent(event)} className="text-red-400">
						<Trash2 className="mr-2 size-3" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default EventCard
