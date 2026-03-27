'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { timeSlots } from '@/types/calendar-types'
import { type ContactStatus, type Lead, statusConfig } from '@/types/crm-types'
import { useEffect, useState } from 'react'

interface LeadDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSave: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void
	editLead?: Lead | null
}

export function LeadDialog({ open, onOpenChange, onSave, editLead }: LeadDialogProps) {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [company, setCompany] = useState('')
	const [status, setStatus] = useState<ContactStatus>('new')
	const [action, setAction] = useState<Lead['action']>({
		title: '',
		date: '',
		startTime: '',
		endTime: ''
	})
	const [note, setNote] = useState('')
	const [info, setInfo] = useState('')

	useEffect(() => {
		if (editLead) {
			setName(editLead.name)
			setEmail(editLead.email || '')
			setPhone(editLead.phone || '')
			setCompany(editLead.company || '')
			setStatus(editLead.status)
			setNote(editLead.note)
			setInfo(editLead.info)
			setAction(editLead.action)
		} else {
			setName('')
			setEmail('')
			setPhone('')
			setCompany('')
			setStatus('new')
			setNote('')
			setInfo('')
		}
	}, [editLead, open])

	const handleSubmit = (e: React.SubmitEvent) => {
		e.preventDefault()
		if (!name.trim()) return

		onSave({
			id: editLead?.id,
			name: name.trim(),
			email: email.trim() || undefined,
			phone: phone.trim() || undefined,
			company: company.trim() || undefined,
			status,
			action: action || undefined,
			note: note.trim(),
			info: info.trim()
		})

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
							<Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="phone">Phone</Label>
							<Input id="phone" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="company">Company</Label>
							<Input id="company" placeholder="Acme Inc." value={company} onChange={(e) => setCompany(e.target.value)} />
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="status">Status</Label>
						<Select value={status} onValueChange={(v) => setStatus(v as ContactStatus)}>
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
						<div className="space-y-2">
							<Label htmlFor="action">Action</Label>
							<Input
								id="action"
								className=""
								placeholder="Presentation call"
								value={action?.title}
								/* @ts-ignore */
								onChange={(e) => setAction((prev) => ({ ...prev, title: e.target.value }))}
							/>
						</div>
						<div className="flex justify-between">
							<div className="space-y-2">
								<Label htmlFor="date">Date</Label>
								<Input
									id="date"
									type="date"
									value={action?.date}
									/* @ts-ignore */
									onChange={(e) => setAction((prev) => ({ ...prev, date: e.target.value }))}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="startTime">Start Time</Label>
								<Select
									value={action?.startTime}
									onValueChange={(e) => {
										/* @ts-ignore */
										setAction((prev) => ({ ...prev, startTime: e }))
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
									value={action?.endTime}
									/* @ts-ignore */
									onValueChange={(e) => setAction((prev) => ({ ...prev, endTime: e }))}
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
							id="note"
							placeholder="Add any notes about this lead..."
							value={note}
							onChange={(e) => setNote(e.target.value)}
							rows={2}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="info">Additional Info</Label>
						<Textarea
							id="info"
							placeholder="Source, interests, requirements, etc..."
							value={info}
							onChange={(e) => setInfo(e.target.value)}
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
