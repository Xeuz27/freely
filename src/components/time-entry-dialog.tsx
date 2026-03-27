'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { type KanbanCard } from '@/types/kanban-types'
import { type Project } from '@/types/project-types'
import { type TimeEntry } from '@/types/timetrack-types'
import { FolderKanban, LayoutGrid } from 'lucide-react'
import { useEffect, useState } from 'react'

interface TimeEntryDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSave: (entry: Omit<TimeEntry, 'id' | 'createdAt'> & { id?: string }) => void
	editEntry?: TimeEntry | null
	initialDate?: Date
	initialStartTime?: string
	initialEndTime?: string
	projects?: Project[]
	kanbanCards?: KanbanCard[]
}

export function TimeEntryDialog({
	open,
	onOpenChange,
	onSave,
	editEntry,
	initialDate,
	initialStartTime,
	initialEndTime,
	projects = [],
	kanbanCards = []
}: TimeEntryDialogProps) {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [date, setDate] = useState('')
	const [startTime, setStartTime] = useState('')
	const [endTime, setEndTime] = useState('')
	const [linkedProjectId, setLinkedProjectId] = useState('')
	const [linkedKanbanId, setLinkedKanbanId] = useState('')
	const [tagsInput, setTagsInput] = useState('')

	useEffect(() => {
		if (editEntry) {
			setTitle(editEntry.title)
			setDescription(editEntry.description || '')
			setDate(editEntry.date.toISOString().split('T')[0])
			setStartTime(editEntry.startTime)
			setEndTime(editEntry.endTime)
			setLinkedProjectId(editEntry.projectId || '')
			setLinkedKanbanId(editEntry.kanbanCardId || '')
			setTagsInput(editEntry.tags?.join(', ') || '')
		} else {
			setTitle('')
			setDescription('')
			setDate(initialDate ? initialDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
			setStartTime(initialStartTime || '')
			setEndTime(initialEndTime || '')
			setLinkedProjectId('')
			setLinkedKanbanId('')
			setTagsInput('')
		}
	}, [editEntry, initialDate, initialStartTime, initialEndTime, open])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!title.trim() || !startTime || !endTime) return

		const tags = tagsInput
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean)

		onSave({
			id: editEntry?.id,
			title: title.trim(),
			description: description.trim() || undefined,
			date: new Date(date),
			startTime,
			endTime,
			projectId: linkedProjectId || undefined,
			kanbanCardId: linkedKanbanId || undefined,
			tags: tags.length > 0 ? tags : undefined
		})

		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>{editEntry ? 'Edit Time Entry' : 'Log Time'}</DialogTitle>
					<DialogDescription>{editEntry ? 'Update your time entry details.' : 'Record what you worked on.'}</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">What did you work on?</Label>
						<Input
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g., Client meeting, Bug fixes, Research..."
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Notes (optional)</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Additional details about this time block..."
							rows={2}
						/>
					</div>

					<div className="grid grid-cols-3 gap-3">
						<div className="space-y-2">
							<Label htmlFor="date">Date</Label>
							<Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
						</div>
						<div className="space-y-2">
							<Label htmlFor="startTime">Start</Label>
							<Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
						</div>
						<div className="space-y-2">
							<Label htmlFor="endTime">End</Label>
							<Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-2">
							<Label className="flex items-center gap-1.5">
								<FolderKanban className="size-3.5" />
								Link to Project
							</Label>
							<Select value={linkedProjectId} onValueChange={setLinkedProjectId}>
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

						<div className="space-y-2">
							<Label className="flex items-center gap-1.5">
								<LayoutGrid className="size-3.5" />
								Link to Task
							</Label>
							<Select value={linkedKanbanId} onValueChange={setLinkedKanbanId}>
								<SelectTrigger>
									<SelectValue placeholder="None" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">None</SelectItem>
									{kanbanCards.map((card) => (
										<SelectItem key={card.id} value={card.id}>
											{card.title}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="tags">Tags (comma-separated)</Label>
						<Input
							id="tags"
							value={tagsInput}
							onChange={(e) => setTagsInput(e.target.value)}
							placeholder="e.g., billable, meeting, deep work"
						/>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type="submit">{editEntry ? 'Update' : 'Log Time'}</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
