import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { eventTypeConfig, type CalendarEvent } from '@/types/calendar-types'
import { AlertCircle, Bell, CheckSquare, Clock, Edit2, MoreHorizontal, MoreVertical, Phone, Trash2, Users } from 'lucide-react'
import useCalendarContext from '../hooks/useCalendarContext'
import { handleDeleteEvent, handleEditEvent } from '../utils/handlers'

const DayEventCard = ({ event }: { event: CalendarEvent }) => {
	const { setEditingEvent, setSelectedDate, setSelectedTime, setDialogOpen } = useCalendarContext()

	return (
		<div
			className={cn(
				'group flex justify-start items-center gap-2 p-1 px-2 md:gap-3 md:p-3 rounded-lg border text-sm cursor-pointer transition-all md:hover:scale-[1.01]',
				eventTypeConfig[event.type].color
			)}
		>
			<div className={cn('flex items-center justify-center size-6 md:size-10 rounded-full shrink-0', 'bg-white/10')}>
				{event.type === 'meeting' && <Users className="size-4 md:size-5" />}
				{event.type === 'call' && <Phone className="size-4 md:size-5" />}
				{event.type === 'task' && <CheckSquare className="size-4 md:size-5" />}
				{event.type === 'reminder' && <Bell className="size-4 md:size-5" />}
				{event.type === 'deadline' && <AlertCircle className="size-4 md:size-5" />}
			</div>
			<div className="flex-1 min-w-0">
				<p className="font-semibold truncate max-md:w-32">{event.title}</p>
				{event.startTime && (
					<div className="flex items-center gap-1.5 mt-1 text-xs opacity-80">
						<Clock className="size-3" />
						<span>
							{event.startTime}
							{event.endTime && ` - ${event.endTime}`}
						</span>
					</div>
				)}
				{event.description && <p className="text-xs max-md:w-32 opacity-70 mt-1 truncate">{event.description}</p>}
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className="flex items-center">
						<button className='md:hidden'>
							<MoreVertical className='size-6' />
						</button>
						<button className="opacity-0 max-md:hidden group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-opacity">
							<MoreHorizontal className="size-4" />
						</button>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => handleEditEvent(event, setEditingEvent, setSelectedDate, setSelectedTime, setDialogOpen)}>
						<Edit2 className="size-4 mr-2" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleDeleteEvent(event)} className="text-red-400">
						<Trash2 className="size-4 mr-2" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export { DayEventCard }
