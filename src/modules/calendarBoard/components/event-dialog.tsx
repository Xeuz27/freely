import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { updateForm, useForm } from '@/modules/core/hooks/useForm'
import { eventTypeConfig, timeSlots, type CalendarEvent, type EventType, type formify } from '@/types/calendar-types'
import { type Lead } from '@/types/crm-types'
import { type KanbanCard } from '@/types/kanban-types'
import { addHour, format } from '@formkit/tempo'
import { AlertCircle, Bell, CheckSquare, Phone, Users } from 'lucide-react'
import { useEffect } from 'react'
import useCalendarContext from '../hooks/useCalendarContext'
import { handleSaveEvent } from '../utils/handlers'

const eventTypeIcons: Record<EventType, React.ReactNode> = {
	meeting: <Users className="size-4" />,
	call: <Phone className="size-4" />,
	task: <CheckSquare className="size-4" />,
	reminder: <Bell className="size-4" />,
	deadline: <AlertCircle className="size-4" />
}
interface EventDialogProps {
	onOpenChange: (open: boolean) => void
	editEvent?: CalendarEvent | undefined
	initialDate: Date | undefined
	initialTime: string | undefined
	leads?: Lead[]
	kanbanCards?: KanbanCard[]
}

export function EventDialog({ onOpenChange, initialDate, initialTime, leads = [], kanbanCards = [] }: EventDialogProps) {
	const initialForm : formify<CalendarEvent>= {
		id:'',
		title: '',
		description: '',
		date: '',
		createdAt: '',
		updatedAt: '',
		startTime: '',
		endTime: '',
		type: 'meeting',
	}
	const {formState, setFormState, onInputChange, onResetForm }= useForm(initialForm)
	const { editingEvent, dialogOpen } = useCalendarContext()
	
	useEffect(() => {
		if (editingEvent) {
			for (const prop in editingEvent){ 
				updateForm(prop as keyof CalendarEvent, editingEvent , setFormState)
			}
		} else {
			setFormState((prev) => ({
				...prev,
				date: initialDate
					? format(initialDate, 'YYYY-MM-DD', 'en')
					: format(new Date(), 'YYYY-MM-DD', 'en'),
				startTime: initialTime || ''
			}))
		}
	}, [])

	const handleSubmit = (e: React.SubmitEvent) => {
		e.preventDefault()
		if (!formState.title.trim()) return

		handleSaveEvent({
			id: editingEvent?.id,
				title: formState.title.trim(),
				description: formState.description!.trim() || undefined, 
				date: new Date(addHour(format(formState.date!, 'YYYY-MM-DD', 'en'), 4)),
				startTime: formState.startTime || undefined,
				endTime: formState.endTime || undefined,
				type: formState.type
		})
		onOpenChange(false)
	}

	return (
		<Dialog open={dialogOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>{editingEvent ? 'Edit Event' : 'New Event'}</DialogTitle>
					<DialogDescription>{editingEvent ? 'Update the event details below.' : 'Add a new event to your calendar.'}</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Title</Label>
						<Input name="title" placeholder="Event title" value={formState.title} onChange={onInputChange} required />
					</div>

					<div className="space-y-2">
						<Label>Event Type</Label>
						<div className="flex flex-wrap gap-2">
							{(Object.keys(eventTypeConfig) as EventType[]).map((t) => (
								<button
									key={t}
									type="button"
									onClick={(t) =>
										onInputChange({
											target: {
												name: 'type',
												//@ts-ignore
												value: t.target.innerText.toLowerCase()
											}
										})
									}
									className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs md:text-sm transition-colors ${
										formState.type === t
											? eventTypeConfig[t].color + ' border'
											: 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary'
									}`}
								>
									{eventTypeIcons[t]}
									{eventTypeConfig[t].label}
								</button>
							))}
						</div>
					</div>

					<div className="grid grid-cols-3 gap-4">
						<div className="space-y-2 col-span-3">
							<Label htmlFor="date">Date</Label>
							<Input name="date" type="date" value={formState.date} onChange={onInputChange} required />
						</div>
						<div className="col-span-3 grid gap-4 grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="startTime">Start Time</Label>
							<Select value={formState.startTime} 
							onValueChange={(value) => {
								onInputChange({
									target: {
										name: 'startTime',
										value: value
									}
								})
							}}
							>
								<SelectTrigger className='w-full mb-0'>
									<SelectValue placeholder="Start" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">No time</SelectItem>
									{timeSlots.map((time) => (
										<SelectItem key={time} value={time}>
											{time}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="endTime">End Time</Label>
							<Select value={formState.endTime} onValueChange={(value) => {
										onInputChange({
											target: {
												name: 'endTime',
												value: value
											}
										})
									}}>
								<SelectTrigger className='w-full mb-0'>
									<SelectValue placeholder="End" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">No time</SelectItem>
									{timeSlots.map((time) => (
										<SelectItem key={time} value={time}>
											{time}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						</div>
					</div>

					<div className="space-y-2 mb-0">
						<Label htmlFor="description">Description</Label>
						<Textarea
						className='mb-0'
							name="description"
							placeholder="Add details..."
							value={formState.description}
							onChange={onInputChange}
							rows={2}
						/>
					</div>
					<div className="flex justify-end gap-2 pt-4">
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type="submit">{editingEvent ? 'Save Changes' : 'Create Event'}</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
