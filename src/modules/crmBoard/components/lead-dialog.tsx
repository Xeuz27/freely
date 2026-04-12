//@ts-nocheck
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import useCalendarContext from '@/modules/calendarBoard/hooks/useCalendarContext'
import { handleSaveEvent } from '@/modules/calendarBoard/utils/handlers'
import { useForm } from '@/modules/core/hooks/useForm'
import { timeSlots } from '@/types/calendar-types'
import { statusConfig, type Lead } from '@/types/crm-types'
import { addHour, format } from '@formkit/tempo'
import { useEffect } from 'react'

type EventType = 'meeting' | 'call' | 'task' | 'reminder' | 'deadline'

interface LeadDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSave: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void
	editLead?: Lead | null
}

export function LeadDialog({ open, onOpenChange, onSave, editLead }: LeadDialogProps) {
	const { setEvents, setEditingEvent, setSelectedDate, setSelectedTime } = useCalendarContext()
	const initialFormState = {
		id: '',
		name: '',
		email: '',
		phone: '',
		company: '',
		status: '',
		note: '',
		info: '',
		createdAt: '',
		updatedAt: ''
	}
	const initialActionState = {
		eventTitle: '',
		eventType: '',
		date: '',
		startTime: '',
		endTime: ''
	}
	const { formState, onInputChange, setFormState, onResetForm } = useForm(initialFormState)
	const {
		formState: actionState,
		onInputChange: onInputChange2,
		setFormState: setFormState2,
		onResetForm: onResetForm2
	} = useForm(initialActionState)

	useEffect(() => {
		if (editLead) {
			for (const prop in editLead) {
				setFormState((prev) => ({ ...prev, [prop]: editLead[prop] }))
			}
		} else {
			onResetForm()
			onResetForm2()
		}
	}, [open, editLead])

	const handleSubmit = (e: React.SubmitEvent) => {
		e.preventDefault()
		if (!formState.name.trim()) return
		onSave({
			id: editLead?.id,
			name: formState.name.trim(),
			email: formState.email.trim() || undefined,
			phone: formState.phone.trim() || undefined,
			company: formState.company.trim() || undefined,
			status: formState.status,
			note: formState.note.trim(),
			info: formState.info.trim()
		})
		if (actionState.eventTitle.length >= 1) {
			handleSaveEvent(
				{
					title: actionState.eventTitle,
					type: actionState.eventType,
					date: new Date(addHour(format(actionState.date, 'YYYY-MM-DDTHH:mm:ssZ', 'en'), 4)),
					startTime: actionState.startTime || undefined,
					endTime: actionState.endTime || undefined
				},
				setEvents,
				setEditingEvent,
				setSelectedDate,
				setSelectedTime
			)
		}
		onResetForm()
		onResetForm2()
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>{editLead ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								name="name"
								placeholder="John Doe"
								//@ts-ignore
								value={formState['name']}
								onChange={onInputChange}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input name="email" type="email" placeholder="john@example.com" value={formState['email']} onChange={onInputChange} />
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="phone">Phone</Label>
							<Input name="phone" placeholder="+1 (555) 000-0000" value={formState['phone']} onChange={onInputChange} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="company">Company</Label>
							<Input name="company" placeholder="Acme Inc." value={formState['company']} onChange={onInputChange} />
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="status">Status</Label>
						<Select
							value={formState['status']}
							onValueChange={(value) =>
								onInputChange({
									target: {
										name: 'status',
										value: value
									}
								})
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(statusConfig).map(([key, config]) => (
									<SelectItem key={key} value={key}>
										<Badge variant="outline" className={`${config.color} border`}>
											{config.label}
										</Badge>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid grid-rows-2 space-y-6 px-8">
						<div className="gap-4 grid grid-cols-2">
							<div className="flex flex-col space-y-2 justify-between">
								<Label htmlFor="action">Event</Label>
								<Input
									name={'eventTitle'}
									className=""
									placeholder="Presentation call"
									value={actionState['eventTitle']}
									onChange={onInputChange2}
								/>
							</div>
							<div className="flex flex-col space-y-2 justify-between">
								<Label htmlFor="eventType">Event Type</Label>
								<Input
									name="eventType"
									className=""
									placeholder="event Type"
									value={actionState['eventType']}
									onChange={onInputChange2}
								></Input>
							</div>
						</div>
						<div className="flex justify-between">
							<div className="space-y-2">
								<Label htmlFor="date">Date</Label>
								<Input name="date" type="date" value={actionState['date']} onChange={onInputChange2} required />
							</div>
							<div className="space-y-2">
								<Label htmlFor="startTime">Start Time</Label>
								<Select
									value={actionState['startTime']}
									onValueChange={(value) => {
										onInputChange2({
											target: {
												name: 'startTime',
												value: value
											}
										})
									}}
								>
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
								<Label htmlFor="startTime">End Time</Label>
								<Select
									value={actionState['endTime']}
									onValueChange={(value) =>
										onInputChange2({
											target: { name: 'endTime', value: value }
										})
									}
								>
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
					</div>

					<div className="space-y-2">
						<Label htmlFor="note">Note</Label>
						<Textarea
							name="note"
							placeholder="Add any notes about this lead..."
							value={formState['note']}
							onChange={onInputChange}
							rows={2}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="info">Additional Info</Label>
						<Textarea
							name="info"
							placeholder="Source, interests, requirements, etc..."
							value={formState['info']}
							onChange={onInputChange}
							rows={2}
						/>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type="submit">{editLead ? 'Save Changes' : 'Add Lead'}</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
