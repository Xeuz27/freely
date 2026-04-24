'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableCell, TableRow } from '@/components/ui/table'
import { type ContactStatus, type Lead, statusConfig } from '@/types/crm-types'
import { Building, Mail, Pencil, Phone, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { handleDeleteLead, handleSaveLead } from '../actions/actions'
import useCrmContext from '../hooks/useCrmContext'
interface LeadRowProps {
	lead: Lead
}

export function LeadRow({ lead }: LeadRowProps) {
	const [isHovered, setIsHovered] = useState(false)
	const {setEditingLead, setDialogOpen} = useCrmContext()
	
	const handleStatusChange = (status: ContactStatus) => {
		handleSaveLead({ ...lead, status })
	}

	const statusInfo = statusConfig[lead.status]

	return (
		<TableRow onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="group">
			<TableCell>
				<div className="flex items-center gap-3">
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

			<TableCell className="max-w-[80px]">
				<p className="text-sm text-muted-foreground truncate">{lead.note || '—'}</p>
			</TableCell>

			<TableCell className="max-w-[80px]">
				<p className="text-sm text-muted-foreground  truncate">{lead.info || '—'}</p>
			</TableCell>

			<TableCell>
				<div className={`transition-opacity flex gap-2 duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>	
					<Button variant={'outline'} onClick={() => {
						setDialogOpen(true)
							setEditingLead(lead)
						 }} className='opacity-30 hover:opacity-100 border-2 hover:border-accent-foreground/20! transition-opacity' >
						<Pencil className="size-4 mr-2" />
						Edit
					</Button>
					<Button variant={'secondary'} onClick={() => handleDeleteLead(lead)} className="text-destructive focus:text-destructive opacity-30 border-2 hover:border-destructive/40! hover:opacity-100 transition-opacity">
						<Trash2 className="size-4 mr-2" />
						Delete
					</Button>
				</div>
			</TableCell>
		</TableRow>
	)
}
