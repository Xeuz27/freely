'use client'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { type Lead } from '@/types/crm-types'
import { type Project, type ProjectPriority, projectPriorityConfig, type ProjectStatus, projectStatusConfig } from '@/types/project-types'
import { AlertCircle, Calendar, Flag, Link2, Trash2, User } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ProjectSheetProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSave: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void
	onDelete?: (id: string) => void
	editProject?: Project | null
	leads?: Lead[]
}

export function ProjectSheet({ open, onOpenChange, onSave, onDelete, editProject, leads = [] }: ProjectSheetProps) {
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [status, setStatus] = useState<ProjectStatus>('planning')
	const [priority, setPriority] = useState<ProjectPriority>('medium')
	const [ownerId, setOwnerId] = useState('')
	const [leadId, setLeadId] = useState('')
	const [startDate, setStartDate] = useState('')
	const [deliveryDate, setDeliveryDate] = useState('')

	useEffect(() => {
		if (editProject) {
			setName(editProject.name)
			setDescription(editProject.description || '')
			setStatus(editProject.status)
			setPriority(editProject.priority)
			setOwnerId(editProject.ownerId || '')
			setLeadId(editProject.leadId || '')
			setStartDate(editProject.startDate.toISOString().split('T')[0])
			setDeliveryDate(editProject.deliveryDate.toISOString().split('T')[0])
		} else {
			const today = new Date()
			const nextMonth = new Date(today)
			nextMonth.setMonth(nextMonth.getMonth() + 1)

			setName('')
			setDescription('')
			setStatus('planning')
			setPriority('medium')
			setOwnerId('')
			setLeadId('')
			setStartDate(today.toISOString().split('T')[0])
			setDeliveryDate(nextMonth.toISOString().split('T')[0])
		}
	}, [editProject, open])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!name.trim() || !startDate || !deliveryDate) return

		onSave({
			id: editProject?.id,
			name: name.trim(),
			description: description.trim() || undefined,
			status,
			priority,
			ownerId: ownerId || undefined,
			leadId: leadId || undefined,
			startDate: new Date(startDate),
			deliveryDate: new Date(deliveryDate)
		})
		onOpenChange(false)
	}

	const handleDelete = () => {
		if (editProject && onDelete) {
			onDelete(editProject.id)
			onOpenChange(false)
		}
	}

	const linkedLead = leads.find((l) => l.id === leadId)

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="sm:max-w-lg overflow-y-auto">
				<SheetHeader>
					<SheetTitle>{editProject ? 'Edit Project' : 'New Project'}</SheetTitle>
					<SheetDescription>
						{editProject ? 'Update project details and settings.' : 'Create a new project to track work.'}
					</SheetDescription>
				</SheetHeader>

				<form onSubmit={handleSubmit} className="flex flex-col gap-6 py-6 px-4">
					<div className="space-y-2">
						<Label htmlFor="name">Project Name</Label>
						<Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter project name" required />
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Describe the project objectives and scope..."
							rows={3}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Status</Label>
							<Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
								<SelectTrigger>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(projectStatusConfig).map(([key, config]) => (
										<SelectItem key={key} value={key}>
											<div className="flex items-center gap-2">
												<Badge variant="outline" className={`${config.color} border text-xs`}>
													{config.label}
												</Badge>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label>Priority</Label>
							<Select value={priority} onValueChange={(v) => setPriority(v as ProjectPriority)}>
								<SelectTrigger>
									<SelectValue placeholder="Select priority" />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(projectPriorityConfig).map(([key, config]) => (
										<SelectItem key={key} value={key}>
											<div className="flex items-center gap-2">
												<Flag className="size-3" />
												<Badge variant="outline" className={`${config.color} border text-xs`}>
													{config.label}
												</Badge>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label className="flex items-center gap-2">
							<Link2 className="size-4 text-muted-foreground" />
							Linked Lead
						</Label>
						<Select value={leadId} onValueChange={setLeadId}>
							<SelectTrigger>
								<SelectValue placeholder="Link to a lead (optional)" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">No linked lead</SelectItem>
								{leads.map((lead) => (
									<SelectItem key={lead.id} value={lead.id}>
										<div className="flex items-center gap-2">
											<span>{lead.name}</span>
											{lead.company && <span className="text-muted-foreground text-xs">({lead.company})</span>}
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{linkedLead && (
							<div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-secondary/50 text-sm">
								<User className="size-4 text-muted-foreground" />
								<span>{linkedLead.name}</span>
								{linkedLead.company && <span className="text-muted-foreground">- {linkedLead.company}</span>}
							</div>
						)}
					</div>

					<div className="space-y-2">
						<Label className="flex items-center gap-2">
							<User className="size-4 text-muted-foreground" />
							Owner
						</Label>
						<Input value={ownerId} onChange={(e) => setOwnerId(e.target.value)} placeholder="Project owner name" />
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="flex items-center gap-2">
								<Calendar className="size-4 text-muted-foreground" />
								Start Date
							</Label>
							<Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
						</div>

						<div className="space-y-2">
							<Label className="flex items-center gap-2">
								<AlertCircle className="size-4 text-muted-foreground" />
								Delivery Date
							</Label>
							<Input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} required />
						</div>
					</div>

					{editProject && (
						<div className="pt-4 border-t border-border">
							<div className="flex items-center justify-between text-xs text-muted-foreground">
								<span>Created: {editProject.createdAt.toLocaleDateString()}</span>
								<span>Updated: {editProject.updatedAt.toLocaleDateString()}</span>
							</div>
						</div>
					)}
				</form>

				<SheetFooter className="border-t border-border">
					<div className="flex items-center justify-between w-full">
						{editProject && onDelete ? (
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="destructive" size="sm">
										<Trash2 className="size-4 mr-1" />
										Delete
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Delete Project</AlertDialogTitle>
										<AlertDialogDescription>
											Are you sure you want to delete &quot;{editProject.name}&quot;? This action cannot be undone.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						) : (
							<div />
						)}
						<div className="flex items-center gap-2">
							<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button onClick={handleSubmit}>{editProject ? 'Save Changes' : 'Create Project'}</Button>
						</div>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
