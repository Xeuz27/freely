import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { type TimeEntry } from '@/types/timetrack-types'
import { Kanban, FolderOpenDot } from 'lucide-react'
import { useEffect } from 'react'
import { addHour, format } from '@formkit/tempo'
import type { formify } from 'src/types/calendar-types'
import { updateForm, useForm } from 'src/modules/core/hooks/useForm'
import useTimetrackContext from '../hooks/useTimeTrackContext'
import useProjectsContext from 'src/modules/projectBoard/hooks/useProjectsContext'
import useKanbanContext from 'src/modules/kanbanBoard/hooks/useKanbanContext'

interface TimeEntryDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSave: (entry: Omit<TimeEntry, 'id' | 'createdAt'> & { id?: string }) => void
	editEntry?: TimeEntry | null
	initialDate?: Date
	initialStartTime?: string
	initialEndTime?: string
}
const splitTags = (tags: string) =>
	tags
		.split(',')
		.map((t: string) => t.trim())
		.filter(Boolean)

export function TimeEntryDialog({
	open,
	onOpenChange,
	onSave,
	initialDate,
	initialStartTime,
	initialEndTime
}: TimeEntryDialogProps) {
	const initialForm: formify<TimeEntry> = {
		id: '',
		title: '',
		description: '',
		date: '',
		startTime: '',
		endTime: '',
		projectId: '',
		kanbanId: '',
		tags: '',
		createdAt: '',
		updatedAt: ''
	}
	const { formState, setFormState, onInputChange, onResetForm } = useForm(initialForm)
	const { editEntry, dialogOpen } = useTimetrackContext()
	const { projects } = useProjectsContext()
	const { kanbanCards } = useKanbanContext()

	useEffect(() => {
		if (editEntry) {
			for (const prop in editEntry) {
				updateForm(prop as keyof TimeEntry, editEntry, setFormState)
			}
		} else {
			setFormState((prev) => ({
				...prev,
				date: initialDate ? format(initialDate, 'YYYY-MM-DD', 'en') : format(new Date(), 'YYYY-MM-DD', 'en'),
				startTime: initialStartTime || '',
				endTime: initialEndTime || ''
			}))
		}
		return () => {
			onResetForm()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dialogOpen])

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!formState.title.trim() || !formState.startTime || !formState.endTime) return

		const tags = formState.tags ? splitTags(formState.tags) : undefined

		onSave({
			id: editEntry?.id,
			title: formState.title.trim(),
			description: formState.description!.trim() || undefined,
			date: new Date(addHour(format(formState.date!, 'YYYY-MM-DD', 'en'), 4)),
			startTime: formState.startTime,
			endTime: formState.endTime,
			projectId: formState.projectId || undefined,
			kanbanId: formState.kanbanId || undefined,
			tags: tags
		})

		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-125">
				<DialogHeader>
					<DialogTitle>{editEntry ? 'Edit Time Entry' : 'Log Time'}</DialogTitle>
					<DialogDescription>
						{editEntry ? 'Update your time entry details.' : 'Record what you worked on.'}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">What did you work on?</Label>
						<Input
							name="title"
							value={formState.title}
							onChange={onInputChange}
							placeholder="e.g., Client meeting, Bug fixes, Research..."
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Notes (optional)</Label>
						<Textarea
							name="description"
							value={formState.description}
							onChange={onInputChange}
							placeholder="Additional details about this time block..."
							rows={2}
						/>
					</div>

					<div className="grid grid-cols-3 gap-3">
						<div className="space-y-2">
							<Label htmlFor="date">Date</Label>
							<Input name="date" type="date" value={formState.date} onChange={onInputChange} required />
						</div>
						<div className="space-y-2">
							<Label htmlFor="startTime">Start Time</Label>
							<Input
								name="startTime"
								type="time"
								value={formState.startTime}
								onChange={onInputChange}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="endTime">End Time</Label>
							<Input
								name="endTime"
								type="time"
								value={formState.endTime}
								onChange={onInputChange}
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-3">
						{/* hacer un select reusable, o inputs reusables o un form reusable, con  RhForms y las validaciones */}

						<div className="space-y-2">
							<Label className="flex items-center gap-1.5">
								<Kanban className="size-3.5" />
								Link to Kanban
							</Label>
							<Select
								value={formState.kanbanId}
								onValueChange={(value) => {
									onInputChange({
										target: {
											name: 'kanbanId',
											value: value
										}
									})
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="None" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">None</SelectItem>
									{kanbanCards.map((kanban) => (
										<SelectItem key={kanban.id} value={kanban.id}>
											{kanban.title}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label className="flex items-center gap-1.5">
								<FolderOpenDot className="size-3.5" />
								Link to Project
							</Label>
							<Select
								value={formState.projectId}
								onValueChange={(value) => {
									onInputChange({
										target: {
											name: 'projectId',
											value: value
										}
									})
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="None" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">None</SelectItem>
									{projects.map((project) => (
										<SelectItem key={project.id} value={project.id}>
											{project.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="tags">Tags (comma-separated)</Label>
						<Input
							name="tags"
							value={formState.tags}
							onChange={onInputChange}
							placeholder="rest, exercise, billable, meeting, deep work"
						/>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type="submit">{editEntry ? 'Save Changes' : 'Create Entry'}</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
