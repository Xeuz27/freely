'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableCell, TableRow } from '@/components/ui/table'
import { type ContactStatus, type Lead, statusConfig } from '@/types/crm-types'
import { Building, Mail, MoreHorizontal, Pencil, Phone, Trash2, User } from 'lucide-react'
import { useState } from 'react'

interface LeadRowProps {
	lead: Lead
	onDelete: (lead: Lead) => void
	onUpdate: (lead: Lead) => void
	onEdit: (lead: Lead) => void
}

export function LeadRow({ lead, onDelete, onUpdate, onEdit }: LeadRowProps) {
	const [isHovered, setIsHovered] = useState(false)

	const handleStatusChange = (status: ContactStatus) => {
		onUpdate({ ...lead, status, updatedAt: new Date() })
	}

	const statusInfo = statusConfig[lead.status]

	return (
		<TableRow onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="group">
			<TableCell>
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center size-9 rounded-full bg-secondary">
						<User className="size-4 text-muted-foreground" />
					</div>
					<div className="flex flex-col">
						<span className="font-medium text-foreground">{lead.name}</span>
						{lead.email && (
							<span className="text-xs text-muted-foreground flex items-center gap-1">
								<Mail className="size-3" />
								{lead.email}
							</span>
						)}
					</div>
				</div>
			</TableCell>

			<TableCell>
				{lead.company && (
					<div className="flex items-center gap-2 text-muted-foreground">
						<Building className="size-4" />
						<span>{lead.company}</span>
					</div>
				)}
			</TableCell>

			<TableCell>
				{lead.phone && (
					<div className="flex items-center gap-2 text-muted-foreground">
						<Phone className="size-4" />
						<span>{lead.phone}</span>
					</div>
				)}
			</TableCell>

			<TableCell>
				<Select value={lead.status} onValueChange={handleStatusChange}>
					<SelectTrigger className={`w-[130px] border ${statusInfo.color}`}>
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
			</TableCell>

			<TableCell className="max-w-[200px]">
				<p className="text-sm text-muted-foreground truncate">{lead.note || '—'}</p>
			</TableCell>

			<TableCell className="max-w-[200px]">
				<p className="text-sm text-muted-foreground truncate">{lead.info || '—'}</p>
			</TableCell>

			<TableCell>
				<div className={`transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="size-8">
								<MoreHorizontal className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => onEdit(lead)}>
								<Pencil className="size-4 mr-2" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onDelete(lead)} className="text-destructive focus:text-destructive">
								<Trash2 className="size-4 mr-2" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</TableCell>
		</TableRow>
	)
}
