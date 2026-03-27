'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { type Lead } from '@/types/crm-types'
import { type Project, projectPriorityConfig, projectStatusConfig } from '@/types/project-types'
import { Calendar, Flag, Link2, MoreHorizontal, User } from 'lucide-react'

interface ProjectRowProps {
	project: Project
	lead?: Lead
	onEdit: (project: Project) => void
	onDelete: (id: string) => void
}

export function ProjectRow({ project, lead, onEdit, onDelete }: ProjectRowProps) {
	const statusConfig = projectStatusConfig[project.status]
	const priorityConfig = projectPriorityConfig[project.priority]

	const today = new Date()
	const deliveryDate = new Date(project.deliveryDate)
	const daysUntilDelivery = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
	const isOverdue = daysUntilDelivery < 0 && project.status !== 'completed' && project.status !== 'cancelled'
	const isNearDeadline = daysUntilDelivery <= 7 && daysUntilDelivery >= 0 && project.status !== 'completed' && project.status !== 'cancelled'

	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		})
	}

	return (
		<TableRow className="group cursor-pointer hover:bg-secondary/30" onClick={() => onEdit(project)}>
			<TableCell>
				<div className="flex flex-col gap-1">
					<span className="font-medium text-foreground">{project.name}</span>
					{project.description && <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{project.description}</span>}
				</div>
			</TableCell>

			<TableCell>
				<Badge variant="outline" className={cn(statusConfig.color, 'border')}>
					{statusConfig.label}
				</Badge>
			</TableCell>

			<TableCell>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<div className="flex items-center gap-1">
								<Flag
									className={cn(
										'size-3',
										project.priority === 'urgent' && 'text-red-400',
										project.priority === 'high' && 'text-orange-400',
										project.priority === 'medium' && 'text-blue-400',
										project.priority === 'low' && 'text-slate-400'
									)}
								/>
								<Badge variant="outline" className={cn(priorityConfig.color, 'border text-xs')}>
									{priorityConfig.label}
								</Badge>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Priority: {priorityConfig.label}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</TableCell>

			<TableCell>
				{lead ? (
					<div className="flex items-center gap-2">
						<Link2 className="size-3 text-muted-foreground" />
						<span className="text-sm">{lead.name}</span>
						{lead.company && <span className="text-xs text-muted-foreground">({lead.company})</span>}
					</div>
				) : (
					<span className="text-muted-foreground text-sm">-</span>
				)}
			</TableCell>

			<TableCell>
				{project.ownerId ? (
					<div className="flex items-center gap-2">
						<User className="size-3 text-muted-foreground" />
						<span className="text-sm">{project.ownerId}</span>
					</div>
				) : (
					<span className="text-muted-foreground text-sm">-</span>
				)}
			</TableCell>

			<TableCell>
				<div className="flex items-center gap-2">
					<Calendar className="size-3 text-muted-foreground" />
					<span className="text-sm">{formatDate(project.startDate)}</span>
				</div>
			</TableCell>

			<TableCell>
				<div className="flex flex-col gap-1">
					<div className={cn('flex items-center gap-2', isOverdue && 'text-red-400', isNearDeadline && 'text-amber-400')}>
						<Calendar className="size-3" />
						<span className="text-sm">{formatDate(deliveryDate)}</span>
					</div>
					{isOverdue && <span className="text-xs text-red-400">{Math.abs(daysUntilDelivery)} days overdue</span>}
					{isNearDeadline && (
						<span className="text-xs text-amber-400">{daysUntilDelivery === 0 ? 'Due today' : `${daysUntilDelivery} days left`}</span>
					)}
				</div>
			</TableCell>

			<TableCell onClick={(e) => e.stopPropagation()}>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
							<MoreHorizontal className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => onEdit(project)}>Edit Project</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => onDelete(project.id)} className="text-destructive">
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	)
}
