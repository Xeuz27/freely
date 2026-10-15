import { calculateDuration, formatDuration,  type TimeEntry } from '@/types/timetrack-types'
import {Timer, MoreHorizontal, Pencil, Trash2, FolderKanban, LayoutGrid, Tag} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import useTimeTracker from '../hooks/useTimetracker'
import { cardTypeColors } from 'src/types/kanban-types'
import { projectStatusConfig } from 'src/types/project-types'

    
export const TimeEntryCard = ({ entry }: { entry: TimeEntry }) => {
        const { getProjectById, getKanbanCardById, handleEditEntry, handleDeleteEntry } = useTimeTracker()
        
		// const duration = calculateDuration(entry.startTime, entry.endTime)
		const project = getProjectById(entry.projectId)
		const kanbanCard = getKanbanCardById(entry.kanbanCardId)

		return (
			<div className="group flex gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
				<div className="flex flex-col items-center text-xs text-muted-foreground w-16 shrink-0">
					<span className="font-medium text-foreground">{entry.startTime}</span>
					<div className="h-6 w-px bg-border my-1" />
					<span className="font-medium text-foreground">{entry.endTime}</span>
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-2">
						<div className="flex-1 min-w-0">
							<h4 className="font-medium text-foreground truncate">{entry.title}</h4>
							{entry.description && <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{entry.description}</p>}
						</div>
						<div className="flex items-center gap-2">
							<Badge variant="secondary" className="shrink-0">
								<Timer className="size-3 mr-1" />
								{/* {formatDuration(duration)} */}
							</Badge>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon" className="size-8 opacity-0 group-hover:opacity-100 transition-opacity">
										<MoreHorizontal className="size-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={() => handleEditEntry(entry)}>
										<Pencil className="size-4 mr-2" />
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleDeleteEntry(entry.id)} className="text-destructive">
										<Trash2 className="size-4 mr-2" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-2 mt-2">
						{project && (
							<Badge variant="outline" className={cn('text-xs', projectStatusConfig[project.status].color)}>
								<FolderKanban className="size-3 mr-1" />
								{project.name}
							</Badge>
						)}
						{kanbanCard && (
							<Badge
								variant="outline"
								className={cn(
									'text-xs',
									cardTypeColors[kanbanCard.type].bg,
									cardTypeColors[kanbanCard.type].text,
									cardTypeColors[kanbanCard.type].border
								)}
							>
								<LayoutGrid className="size-3 mr-1" />
								{kanbanCard.title}
							</Badge>
						)}
						{entry.tags?.map((tag) => (
							<Badge key={tag} variant="secondary" className="text-xs">
								<Tag className="size-3 mr-1" />
								{tag}
							</Badge>
						))}
					</div>
				</div>
			</div>
		)
	}