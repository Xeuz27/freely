import { calculateDuration, formatDuration, type TimeEntry } from '@/types/timetrack-types'
import { Timer, MoreHorizontal, Pencil, Trash2, FolderKanban, LayoutGrid, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { cardTypeColors } from 'src/types/kanban-types'
import { projectStatusConfig } from 'src/types/project-types'
import useHandlers from '../hooks/useHandlers'

export const TimeEntryCard = ({ entry }: { entry: TimeEntry }) => {
	const { handleEditEntry, handleDeleteEntry, getKanbanCardById, getProjectById } = useHandlers()

	const duration = calculateDuration(entry.startTime, entry.endTime)
	const project = getProjectById(entry.projectId)
	const kanbanCard = getKanbanCardById(entry.kanbanId)

	return (
		<div className="group bg-card border-border hover:border-primary/30 flex gap-4 rounded-lg border p-4 transition-colors">
			<div className="text-muted-foreground flex w-16 shrink-0 flex-col items-center text-xs">
				<span className="text-foreground font-medium">{entry.startTime}</span>
				<div className="bg-border my-1 h-6 w-px" />
				<span className="text-foreground font-medium">{entry.endTime}</span>
			</div>

			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0 flex-1">
						<h4 className="text-foreground truncate font-medium">{entry.title}</h4>
						{entry.description && (
							<p className="text-muted-foreground mt-0.5 line-clamp-2 text-sm">{entry.description}</p>
						)}
					</div>
					<div className="flex items-center gap-2">
						<Badge variant="secondary" className="shrink-0">
							<Timer className="mr-1 size-3" />
							{formatDuration(duration)}
						</Badge>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="size-8 opacity-0 transition-opacity group-hover:opacity-100"
								>
									<MoreHorizontal className="size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => handleEditEntry(entry)}>
									<Pencil className="mr-2 size-4" />
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleDeleteEntry(entry)} className="text-destructive">
									<Trash2 className="mr-2 size-4" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<div className="mt-2 flex flex-wrap items-center gap-2">
					{project && (
						<Badge variant="outline" className={cn('text-xs', projectStatusConfig[project.status].color)}>
							<FolderKanban className="mr-1 size-3" />
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
							<LayoutGrid className="mr-1 size-3" />
							{kanbanCard.title}
						</Badge>
					)}
					{entry.tags?.map((tag) => (
						<Badge key={tag} variant="secondary" className="text-xs">
							<Tag className="mr-1 size-3" />
							{tag}
						</Badge>
					))}
				</div>
			</div>
		</div>
	)
}
