import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'
import { sampleProjects } from '@/modules/timeTrackBoard/components/timetrack-board'
import { type CardType, cardTypeColors } from '@/types/kanban-types'
import { CheckSquare, Database, FileText, FolderKanban, Lightbulb, UserRoundPlus } from 'lucide-react'
import { sampleLeads } from '../../crmBoard/components/crm-board'

interface AddCardDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onAddCard: (card: { title: string; description: string; type: CardType; tags: string[] }) => void
}

const typeOptions: { value: CardType; label: string; icon: typeof CheckSquare }[] = [
	{ value: 'task', label: 'Task', icon: CheckSquare },
	{ value: 'note', label: 'Note', icon: FileText },
	{ value: 'idea', label: 'Idea', icon: Lightbulb },
	{ value: 'data', label: 'Data', icon: Database },
	{ value: 'lead', label: 'Lead', icon: UserRoundPlus }
]

export function AddCardDialog({ open, onOpenChange, onAddCard }: AddCardDialogProps) {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [type, setType] = useState<CardType>('task')
	const [tagsInput, setTagsInput] = useState('')
	const [linkedProjectId, setLinkedProjectId] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!title.trim()) return

		onAddCard({
			title: title.trim(),
			description: description.trim(),
			type,
			tags: tagsInput
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean)
		})

		setTitle('')
		setDescription('')
		setType('task')
		setTagsInput('')
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Add New Item</DialogTitle>
						<DialogDescription>Create a new task, note, idea, lead, or data entry.</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="type">Type</Label>
							<div className="grid grid-cols-4 gap-2">
								{typeOptions.map((option) => {
									const colors = cardTypeColors[option.value]
									const Icon = option.icon
									return (
										<button
											key={option.value}
											type="button"
											onClick={() => setType(option.value)}
											className={cn(
												'flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all',
												type === option.value
													? cn(colors.bg, colors.border, colors.text.replace('text-', 'ring-'))
													: 'border-border hover:bg-secondary/50'
											)}
										>
											<Icon className={cn('size-4', type === option.value ? colors.text : 'text-muted-foreground')} />
											<span
												className={cn(
													'text-[10px] font-medium',
													type === option.value ? colors.text : 'text-muted-foreground'
												)}
											>
												{option.label}
											</span>
										</button>
									)
								})}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input id="title" placeholder="Enter a title..." value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description (optional)</Label>
							<Textarea
								id="description"
								placeholder="Add more details..."
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={3}
							/>
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
										{sampleProjects.map((project) => (
											<SelectItem key={project.id} value={project.id}>
												{project.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label className="flex items-center gap-1.5">
									<FolderKanban className="size-3.5" />
									Link to Lead
								</Label>
								<Select value={linkedProjectId} onValueChange={setLinkedProjectId}>
									<SelectTrigger>
										<SelectValue placeholder="None" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">None</SelectItem>
										{sampleLeads.map((project) => (
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
								id="tags"
								placeholder="work, urgent, personal..."
								value={tagsInput}
								onChange={(e) => setTagsInput(e.target.value)}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={!title.trim()}>
							Add Item
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
