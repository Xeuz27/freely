'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { type CardType, cardTypeColors } from '@/types/kanban-types'
import { CheckSquare, Database, FileText, Lightbulb } from 'lucide-react'
import { useState } from 'react'

interface AddCardDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onAddCard: (card: { title: string; description: string; type: CardType; tags: string[] }) => void
}

const typeOptions: { value: CardType; label: string; icon: typeof CheckSquare }[] = [
	{ value: 'task', label: 'Task', icon: CheckSquare },
	{ value: 'note', label: 'Note', icon: FileText },
	{ value: 'idea', label: 'Idea', icon: Lightbulb },
	{ value: 'data', label: 'Data', icon: Database }
]

export function AddCardDialog({ open, onOpenChange, onAddCard }: AddCardDialogProps) {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [type, setType] = useState<CardType>('task')
	const [tagsInput, setTagsInput] = useState('')

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
						<DialogDescription>Create a new task, note, idea, or data entry.</DialogDescription>
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
