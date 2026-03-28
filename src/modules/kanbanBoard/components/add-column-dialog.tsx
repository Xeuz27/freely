'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

interface AddColumnDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onAddColumn: (title: string) => void
}

export function AddColumnDialog({ open, onOpenChange, onAddColumn }: AddColumnDialogProps) {
	const [title, setTitle] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!title.trim()) return

		onAddColumn(title.trim())
		setTitle('')
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-sm">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Add New Column</DialogTitle>
						<DialogDescription>Create a new column to organize your items.</DialogDescription>
					</DialogHeader>

					<div className="py-4">
						<div className="space-y-2">
							<Label htmlFor="column-title">Column Name</Label>
							<Input
								id="column-title"
								placeholder="e.g., In Progress, Ideas, Research..."
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								autoFocus
							/>
						</div>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={!title.trim()}>
							Add Column
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
