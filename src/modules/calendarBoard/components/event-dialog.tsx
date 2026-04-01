import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { type CalendarEvent, type EventType, eventTypeConfig, timeSlots } from '@/types/calendar-types'
import { type Lead } from '@/types/crm-types'
import { type KanbanCard } from '@/types/kanban-types'
import { AlertCircle, Bell, CheckSquare, Link2, Phone, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import useCalendarContext from '../hooks/useCalendarContext'

const eventTypeIcons: Record<EventType, React.ReactNode> = {
	meeting: <Users className="size-4" />,
	call: <Phone className="size-4" />,
	task: <CheckSquare className="size-4" />,
	reminder: <Bell className="size-4" />,
	deadline: <AlertCircle className="size-4" />
}
type eventData = Omit<CalendarEvent, 'id' | 'createdAt'> & { id?: string }
interface EventDialogProps {
	onOpenChange: (open: boolean) => void
	onSave: (event: eventData, setEvents: any, setEditingEvent: any, setSelectedDate: any, setSelectedTime: any) => void
	editEvent?: CalendarEvent | null
	initialDate?: Date
	initialTime?: string
	leads?: Lead[]
	kanbanCards?: KanbanCard[]
}

export function EventDialog({ onOpenChange, onSave, initialDate, initialTime, leads = [], kanbanCards = [] }: EventDialogProps) {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [date, setDate] = useState('')
	const [startTime, setStartTime] = useState('')
	const [endTime, setEndTime] = useState('')
	const [type, setType] = useState<EventType>('meeting')
	const [linkedLeadId, setLinkedLeadId] = useState<string>('')
	const [linkedKanbanId, setLinkedKanbanId] = useState<string>('')

	const { setEvents, editingEvent, setEditingEvent, setSelectedDate, setSelectedTime, dialogOpen } = useCalendarContext()

	useEffect(() => {
		if (editingEvent) {
			setTitle(editingEvent.title)
			setDescription(editingEvent.description || '')
			setDate(editingEvent.date.toISOString().split('T')[0])
			setStartTime(editingEvent.startTime || '')
			setEndTime(editingEvent.endTime || '')
			setType(editingEvent.type)
			setLinkedLeadId(editingEvent.leadId || '')
			setLinkedKanbanId(editingEvent.kanbanCardId || '')
		} else {
			setTitle('')
			setDescription('')
			setDate(initialDate ? initialDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
			setStartTime(initialTime || '')
			setEndTime('')
			setType('meeting')
			setLinkedLeadId('')
			setLinkedKanbanId('')
		}
	}, [editingEvent, initialDate, initialTime])

	const handleSubmit = (e: React.SubmitEvent) => {
		e.preventDefault()
		if (!title.trim() || !date) return

		const selectedLead = leads.find((l) => l.id === linkedLeadId)
		const selectedKanban = kanbanCards.find((c) => c.id === linkedKanbanId)

		onSave(
			{
				id: editingEvent?.id,
				title: title.trim(),
				description: description.trim() || undefined,
				date: new Date(date),
				startTime: startTime || undefined,
				endTime: endTime || undefined,
				type,
				leadId: linkedLeadId || undefined,
				leadName: selectedLead?.name,
				leadStatus: selectedLead?.status,
				kanbanCardId: linkedKanbanId || undefined,
				kanbanCardTitle: selectedKanban?.title,
				kanbanCardType: selectedKanban?.type
			},
			setEvents,
			setEditingEvent,
			setSelectedDate,
			setSelectedTime
		)
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
						<Input id="title" placeholder="Event title" value={title} onChange={(e) => setTitle(e.target.value)} required />
					</div>

					<div className="space-y-2">
						<Label>Event Type</Label>
						<div className="flex flex-wrap gap-2">
							{(Object.keys(eventTypeConfig) as EventType[]).map((t) => (
								<button
									key={t}
									type="button"
									onClick={() => setType(t)}
									className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
										type === t
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

					<div className="grid grid-cols-3 gap-3">
						<div className="space-y-2">
							<Label htmlFor="date">Date</Label>
							<Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
						</div>
						<div className="space-y-2">
							<Label htmlFor="startTime">Start Time</Label>
							<Select value={startTime} onValueChange={setStartTime}>
								<SelectTrigger>
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
							<Select value={endTime} onValueChange={setEndTime}>
								<SelectTrigger>
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

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Add details..."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={2}
						/>
					</div>

					<div className="space-y-3 pt-2 border-t border-border">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Link2 className="size-4" />
							<span>Link to...</span>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-2">
								<Label className="text-xs">Lead</Label>
								<Select value={linkedLeadId} onValueChange={setLinkedLeadId}>
									<SelectTrigger>
										<SelectValue placeholder="Select lead" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">No lead</SelectItem>
										{leads.map((lead) => (
											<SelectItem key={lead.id} value={lead.id}>
												<div className="flex items-center gap-2">
													<span>{lead.name}</span>
													{lead.company && <span className="text-xs text-muted-foreground">({lead.company})</span>}
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label className="text-xs">Kanban Card</Label>
								<Select value={linkedKanbanId} onValueChange={setLinkedKanbanId}>
									<SelectTrigger>
										<SelectValue placeholder="Select card" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">No card</SelectItem>
										{kanbanCards.map((card) => (
											<SelectItem key={card.id} value={card.id}>
												<div className="flex items-center gap-2">
													<span>{card.title}</span>
													<Badge variant="outline" className="text-xs">
														{card.type}
													</Badge>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
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
