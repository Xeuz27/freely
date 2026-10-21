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
	const { setEditingLead, setDialogOpen } = useCrmContext()

	const handleStatusChange = (status: ContactStatus) => {
		handleSaveLead({ ...lead, status })
	}

	const statusInfo = statusConfig[lead.status]

	return (
		<TableRow onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="group">
			<TableCell>
				<div className="flex items-center gap-3">
					<div className="flex flex-col">
						<span className="text-foreground font-medium">{lead.name}</span>
						{lead.email && (
							<span className="text-muted-foreground flex items-center gap-1 text-xs">
								<Mail className="size-3" />
								{lead.email}
							</span>
						)}
					</div>
				</div>
			</TableCell>

			<TableCell>
				{lead.company && (
					<div className="text-muted-foreground flex items-center gap-2">
						<Building className="size-4" />
						<span>{lead.company}</span>
					</div>
				)}
			</TableCell>

			<TableCell>
				{lead.phone && (
					<div className="text-muted-foreground flex items-center gap-2">
						<Phone className="size-4" />
						<span>{lead.phone}</span>
					</div>
				)}
			</TableCell>

			<TableCell>
				<Select value={lead.status} onValueChange={handleStatusChange}>
					<SelectTrigger className={`w-32.5 border ${statusInfo.color}`}>
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

			<TableCell className="max-w-20">
				<p className="text-muted-foreground truncate text-sm">{lead.note || '—'}</p>
			</TableCell>

			<TableCell className="max-w-20">
				<p className="text-muted-foreground truncate text-sm">{lead.info || '—'}</p>
			</TableCell>

			<TableCell>
				<div
					className={`flex gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
				>
					<Button
						variant={'outline'}
						onClick={() => {
							setDialogOpen(true)
							setEditingLead(lead)
						}}
						className="hover:border-accent-foreground/20! border-2 opacity-30 transition-opacity hover:opacity-100"
					>
						<Pencil className="mr-2 size-4" />
						Edit
					</Button>
					<Button
						variant={'secondary'}
						onClick={() => handleDeleteLead(lead)}
						className="text-destructive focus:text-destructive hover:border-destructive/40! border-2 opacity-30 transition-opacity hover:opacity-100"
					>
						<Trash2 className="mr-2 size-4" />
						Delete
					</Button>
				</div>
			</TableCell>
		</TableRow>
	)
}
